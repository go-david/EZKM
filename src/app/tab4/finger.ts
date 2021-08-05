// 手势密码类
export default class Finger {
    public config = {
        id: 'canvas', // 父元素的id
        width: 600, // 宽
        height: 600, // 高
        bgColor: '#fff', // 背景色
        lineColor: '#0089FF', // 线条颜色
        lineSize: 3, // 线条粗细
        errorColor: '#f56c6c', // 错误颜色
        cols: 3, // 一行有几个点
        rows: 3, // 一列有几个点
    };

    public r: any;
    public points: any;
    public path: any[];
    public ctx: any;
    public start: any;
    public callback: any;

    // config 基础配置, callback 绘制结束时候的路径数组
    constructor(c: any, callback) {

        this.callback = callback;

        this.start = false; // 是否开始触摸

        // 接收参数
        Object.assign(this.config, c);

        // 原点半径
        this.r = 16;

        // 初始化所有圆点坐标
        this.points = this.initPoints();

        // 初始化路线
        this.path = [];

        // 创建canvas元素
        this.ctx = this.initCanvas();

        // 画背景
        this.drawBG();

        // 画圆
        this.drawPoint();


    }

    // 初始化canvas
    initCanvas() {
        const box = document.querySelector('#' + this.config.id);
        const canvas = document.createElement('canvas');
        canvas.width = this.config.width;
        canvas.height = this.config.height;
        // 初始化事件监听
        canvas.addEventListener('mousedown', this.onTouchStart.bind(this));
        canvas.addEventListener('touchstart', this.onTouchStart.bind(this));
        canvas.addEventListener('mousemove', this.onTouchMove.bind(this));
        canvas.addEventListener('touchmove', this.onTouchMove.bind(this));
        window.addEventListener('mouseup', this.onTouchEnd.bind(this)); // 如果只监听canvas那么在canvas之外放开鼠标就不起作用了
        box.appendChild(canvas);
        return canvas.getContext('2d');
    }

    // 初始化点的半径
    initRoundR() {
        const wr = this.config.width / (this.config.cols * 3 - 1); // 间隔一个r
        const hr = this.config.height / (this.config.rows * 3 - 1);
        return wr > hr ? hr : wr;
    }

    // 初始化所有圆心坐标
    initPoints() {
        const diffX = (this.config.width - (this.config.cols * this.r * 2)) / (this.config.cols - 1); // 列间距
        const diffY = (this.config.height - (this.config.rows * this.r * 2)) / (this.config.rows - 1); // 行间距
        const len = this.config.cols * this.config.rows;
        const cols = this.config.cols;
        const arr = [];
        for (let i = 0; i < len; i++) {
            const obj: any = {};
            obj.x = (i % cols) * (diffX + 2 * this.r) + this.r; // x坐标  ==> (i % cols) 为偏离值  ==》 (diffX + 2 * this.r) 为偏离的内容，分别是多少个圆和多少个间隔
            obj.y = Math.floor(i / cols) * (diffY + 2 * this.r) + this.r;
            obj.r = this.r;
            obj.lineColor = this.config.lineColor;
            obj.errorColor = this.config.errorColor;
            obj.bgColor = this.config.bgColor;
            obj.lineSize = this.config.lineSize;
            obj.active = false;
            obj.error = false;
            arr.push(obj);
        }
        return arr;
    }

    // 画背景
    drawBG() {
        this.ctx.fillStyle = this.config.bgColor;
        this.ctx.fillRect(0, 0, this.config.width, this.config.height);
    }

    // 画点
    drawPoint() {
        this.points.forEach(e => {
            console.log(e);

            new Point(this.ctx, e);
        });

    }

    // 绘制结果
    // arr [] 绘制的路线   error 是否是错误状态
    drawResult(arr, error) {
        this.drawBG();
        this.drawPath(arr, error);
        this.drawPoint();
    }

    // 绘制路线
    // arr [] 绘制的路线   error 是否是错误状态
    drawPath(arr: any[], error?: any) {
        if (!arr || !arr.length) { return; };
        this.path = arr;
        const len = arr.length;
        this.ctx.moveTo(this.points[arr[0] - 1].x, this.points[arr[0] - 1].y);
        for (let i = 1; i < len; i++) {
            this.ctx.lineTo(this.points[arr[i] - 1].x, this.points[arr[i] - 1].y);
        }
        this.ctx.lineWidth = this.config.lineSize;
        this.ctx.strokeStyle = error ? this.config.errorColor : this.config.lineColor;
        this.ctx.stroke();

        arr.forEach(e => {

            this.points[e - 1].active = true;
            if (error) {
                this.points[e - 1].error = true;
            }
        });
    }


    // 被触摸
    onTouchStart(e) {
        console.log(e);

        const index = this.points.findIndex(p => calcL(e.offsetX, e.offsetY, p.x, p.y, p.r));
        if (index > -1) {
            this.path = [index + 1];
            this.drawPath(this.path);
            this.drawPoint();
        }
        this.start = true;
    }

    // 触摸移动
    onTouchMove(e) {
        if (!this.start) { return; };

        const index = this.points.findIndex(p => calcL(e.offsetX, e.offsetY, p.x, p.y, p.r));

        console.log(index);

        if (index > -1 && !this.points[index].active) {
            this.path.push(index + 1);
        }
        this.ctx.clearRect(0, 0, this.config.width, this.config.height);
        // 画及时连线
        this.drawBG();
        this.drawLine(e.offsetX, e.offsetY);
        this.drawPath(this.path);
        this.drawPoint();
    }

    // 画及时连线
    drawLine(toX, toY) {
        if (!this.path.length) { return; };
        const index = this.path[this.path.length - 1] - 1;
        const x = this.points[index].x;
        const y = this.points[index].y;
        this.ctx.moveTo(x, y);
        this.ctx.lineTo(toX, toY);
        this.ctx.lineWidth = this.config.lineSize;
        this.ctx.strokeStyle = this.config.lineColor;
        this.ctx.stroke();
    }

    // 手指释放
    onTouchEnd() {
        if (this.start) {
            this.callback(this.path);
        }
        this.path = [];
        this.reset();
    }


    // 重置
    reset() {
        this.points.forEach(e => {
            e.active = false;
            e.error = false;
        });
        this.start = false;
        this.path = [];
        this.ctx.clearRect(0, 0, this.config.width, this.config.height);
        this.drawBG();
        this.drawPoint();
    }
}


// 原点类

class Point {

    public config: any = {
        x: 0, // 圆心x坐标
        y: 0, // 圆心y坐标
        r: 0, // 半径
        lineColor: '#0089FF', // 线条颜色
        bgColor: '#fff', // 背景颜色
        errorColor: '', // 错误颜色
        active: false, // 是否被选中
        error: false, // 是否是错误状态
    };

    public ctx: any;

    constructor(ctx, c) {

        this.ctx = ctx;

        Object.assign(this.config, c);
        this.drawPoint();

    }

    drawPoint() {
        const color = this.config.error ? this.config.errorColor : this.config.lineColor;
        this.ctx.beginPath();
        this.ctx.arc(this.config.x, this.config.y, this.config.r - this.config.lineSize, 0, Math.PI * 2);
        this.ctx.fillStyle = this.config.bgColor;
        this.ctx.fill();
        this.ctx.lineWidth = this.config.lineSize;
        this.ctx.strokeStyle = color;
        this.ctx.stroke();
        if (this.config.active) {
            this.ctx.beginPath();
            this.ctx.arc(this.config.x, this.config.y, this.config.r / 3, 0, Math.PI * 2);
            this.ctx.fillStyle = color;
            this.ctx.fill();
        }
    }

}


// 计算两点之间的距离，判断点a是否在圆b中
// ax 点a的x坐标
// ay 点a的y坐标
// bx 圆b圆心的x坐标
// by 圆b圆心的y坐标
// br 圆b的半径
// return 在圆中为true 反之为false
// eslint-disable-next-line prefer-arrow/prefer-arrow-functions
function calcL(ax, ay, bx, by, br) {
    return br > Math.sqrt((ax - bx) * (ax - bx) + (ay - by) * (ay - by));
}
