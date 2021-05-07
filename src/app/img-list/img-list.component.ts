import { Component, OnInit } from '@angular/core';
import { fromEvent } from 'rxjs';
import { debounceTime, throttleTime } from 'rxjs/operators';
@Component({
  selector: 'app-img-list',
  templateUrl: './img-list.component.html',
  styleUrls: ['./img-list.component.scss']
})
export class ImgListComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
    let colCount = 8   //定义列数
    let colHeightArry = []   //定义列高度数组
    let imgWidth = document.querySelector('.waterfall').clientWidth / colCount   //单张图片的宽度
    var scrollTop = 0, topValue = this.getScrollTop();
    for (let i = 0; i < colCount; i++) {
      colHeightArry[i] = 0
    }
    document.querySelectorAll('.waterfall .imgBox').forEach((item: HTMLElement) => {
      item.addEventListener('load', function () {
        item.style.width = `${imgWidth}px`
        let minValue = colHeightArry[0]  //定义最小的高度
        let minIndex = 0  //定义最小高度的下标
        for (let i = 0; i < colCount; i++) {
          if (colHeightArry[i] < minValue) {   //如果最小高度组数中的值小于最小值
            minValue = colHeightArry[i]   //那么认为最小高度数组中的值是真正的最小值
            minIndex = i  //最小下标为当前下标
          }
        }
        this.style.left = `${minIndex * imgWidth}px`
        this.style.top = `${minValue}px`
        colHeightArry[minIndex] += this.clientHeight
      })
    })
    //当窗口大小重置之后，重新执行
    window.addEventListener('resize', function () {
      console.log(1)
      reset()
    })
    //当窗口加载完毕，执行瀑布流
    window.addEventListener('load', function () {
      console.log(1)
      reset()
    })
    //定义reset函数
    function reset() {
      let colHeightArry = []
      imgWidth = document.querySelector('.waterfall').clientWidth / colCount
      for (let i = 0; i < colCount; i++) {
        colHeightArry[i] = 0
      }
      document.querySelectorAll('.waterfall .imgBox').forEach((item: HTMLElement) => {
        item.style.width = `${imgWidth}px`
        let minValue = colHeightArry[0]
        let minIndex = 0
        for (let i = 0; i < colCount; i++) {
          if (colHeightArry[i] < minValue) {
            minValue = colHeightArry[i]
            minIndex = i
          }
        }


        item.style.left = `${minIndex * imgWidth}px`
        item.style.top = `${minValue}px`
        colHeightArry[minIndex] += item.clientHeight
      })
    }
    // document.addEventListener('mousemove', function (e) {
    //   console.log(e.x)
    // })
    fromEvent(document, 'mousemove').pipe(throttleTime(16)).subscribe((e) => {
      let x: any = e
      console.log(x.x * 2 / document.body.clientWidth * 20 - 20)
      console.dir(document.querySelector<HTMLElement>('.waterfall'))
      document.querySelector<HTMLElement>('.waterfall').style.right = `${x.x * 2 / document.body.clientWidth * 100 - 100}px`
    })
    fromEvent(window, 'scroll').pipe(throttleTime(16)).subscribe((e) => {
      console.log(e)
      // document.querySelector<HTMLElement>('.waterfall').style.transform = `${x.x * 2 / document.body.clientWidth * 100 - 100}px`
      scrollTop = this.getScrollTop();
      if (scrollTop <= topValue) {
        console.log('向上滚动')
        // document.querySelector<HTMLElement>('.waterfall').style.transform = `rotate(-5deg) scale(1.2)  skew(-5deg, 5deg) rotate(0.01deg)`
      }
      else {
        console.log('向下滚动')
        // document.querySelector<HTMLElement>('.waterfall').style.transform = `rotate(-5deg) scale(1.2)  skew(5deg, -5deg) rotate(0.01deg)`
      }
      setTimeout(function () { topValue = scrollTop; }, 0);
    })
  }
  getScrollTop() {
    var scrollTop = 0;
    if (document.documentElement && document.documentElement.scrollTop) {
      scrollTop = document.documentElement.scrollTop;
    }
    else if (document.body) {
      scrollTop = document.body.scrollTop;
    }
    return scrollTop;
  }
}
