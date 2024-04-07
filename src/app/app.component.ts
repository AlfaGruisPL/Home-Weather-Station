import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  ngOnInit() {
    setInterval(() => {
      var myHeaders = new Headers();
      myHeaders.append('pragma', 'no-cache');
      myHeaders.append('cache-control', 'no-cache');
      var myInit = {
        method: 'GET',
        headers: myHeaders,
      };
      /*fetch("https://spiderservices.pl/stacja/index/", myInit)
        .then((response) => response.text())
        .then((data) => {
          var k = data.split("<script")[3].split("type")[0];
          if (document.body.innerHTML.trim().split("<script")[3].split("type")[0] != k) {
            //window.location.reload();
          }
        });*/
    }, 5000)

  }

}
