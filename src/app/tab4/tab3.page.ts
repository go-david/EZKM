import { Component, OnInit } from '@angular/core';
import Finger from './finger';

@Component({
  selector: 'app-tab4',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab4Page implements OnInit {

  constructor() { }

  ngOnInit() {
    const reset = () => {
      const box = document.querySelector('#_finger_password');

      console.log(box);

      box.innerHTML = '';

      const arr = document.querySelectorAll('input');
      const config = {
        id: '_finger_password', // id 必传
        width: 288, // 宽
        height: 288, // 高
        bgColor: '#fff', // 背景色
        lineColor: '#58A09B', // 线条颜色
        lineSize: 3, // 线条粗细
        errorColor: '#f56c6c', // 错误颜色
        cols: 3, // 一行有几个点
        rows: 3, // 一列有几个点
      };
      const finger = new Finger(config, path => {
        console.log('路径', path);
        alert('路径： ' + path);
        if (path) {
          setTimeout(() => { // 这里需要设置延时
            finger.drawResult(path, true); // 展示错误颜色
          }, 0);
          setTimeout(() => {
            finger.reset(); // 重置画板
          }, 500);
        }
      }
      );
    };

    setTimeout(() => {
      reset();
    }, 2000);

  }
}
