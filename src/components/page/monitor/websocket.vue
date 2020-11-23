<template>
    <div class="container"></div>
</template>

<script>
import { listOnline, deleteOnline } from '@/api/monitor/online.js';
export default {
    data() {
        return {};
    },
    created() {},
    computed: {},
    mounted() {
        if ('WebSocket' in window) {
            this.websocket = new WebSocket('ws://localhost:8090/websocket/' + this.$store.getters.username);
            this.msgSuccess('连接浏览器');
            this.initWebSocket();
        } else {
            this.msgError('当前浏览器 不支持');
        }
    },
    beforeDestroy() {
        this.onbeforeunload();
    },
    methods: {
        initWebSocket() {
            // 连接错误
            this.websocket.onerror = this.setErrorMessage;
            // 连接成功
            this.websocket.onopen = this.setOnopenMessage;
            // 收到消息的回调
            this.websocket.onmessage = this.setOnmessageMessage;
            // 连接关闭的回调
            this.websocket.onclose = this.setOncloseMessage;
            // 监听窗口关闭事件，当窗口关闭时，主动去关闭websocket连接，防止连接还没断开就关闭窗口，server端会抛异常。
            window.onbeforeunload = this.onbeforeunload;
        },
        setErrorMessage() {
            console.log('WebSocket连接发生错误状态码：', this.websocket.readyState);
        },
        setOnopenMessage() {
            console.log('WebSocket连接成功状态码：', this.websocket.readyState);
        },
        setOnmessageMessage(event) {
            // 根据服务器推送的消息做自己的业务处理
            console.log('服务端返回：', event);
            this.msgSuccess(event.data);
        },
        setOncloseMessage() {
            console.log('WebSocket连接关闭状态码：', this.websocket.readyState);
        },
        onbeforeunload() {
            this.closeWebSocket();
        },
        closeWebSocket() {
            this.websocket.close();
        }
    }
};
</script>

<style scoped></style>
