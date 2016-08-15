
var domain = "http://www.tv-asahi.co.jp"
//var url = domain + "/bangumi/index.html";
$.get(url(), function(data){
  var program_tds = $(data.responseText).find('table.new_day td:has(span)');
  $("img", program_tds).remove();

  var programs = program_tds.get().map(parse);

  var programs_A12N = programs.filter(function(program) {
    return (program.title.match(/暴れん坊将軍/));
  });

  var tgt = new Date();
  if (tgt.getHours() >= 5) {
    tgt.setDate(tgt.getDate() + 1);
  }
  tgt.setHours(4, 0, 0, 0);

  var program_A12N = programs_A12N.filter(function(program) {
    return (program.date.toString() == tgt.toString());
  });

  if (program_A12N[0]) {
    $("li#date").text(program_A12N[0].date.toString());
    $("li#title").text(program_A12N[0].title);
    $("li#subtitle").text(program_A12N[0].subtitle);
    $("li#outline").text(program_A12N[0].outline);
    $("li#link").html('<a href="' + program_A12N[0].link + '" target="_blank">公式サイト</a>');
  }
  tmp = program_A12N[0];

});

// ダサい。非同期に index.html も next.html も取得したい;
function
url() {
  var date = new Date();
  d = date.getDay();
  h = date.getHours();

  if ( d == 0 && h > 5 ) { // 日曜日の 5:00 以降は next.html を指定する;
    return domain + "/bangumi/next.html"
  } else {
    return domain + "/bangumi/index.html"
  }

  //TODO 月曜日の挙動がおかしいので要検証
}


// きれいなデータが渡されることを想定しています;
function
parse(program_td) {

  var title = $("span.prog_name > a", program_td).text();
  var subtitle = $("span.expo > a", program_td).text();
  var outline = $("span.expo_org > a", program_td).text();

  var href = $("a", program_td).attr("href"); // "/pr/contents/YYYYMMDD_XXXXX.html";
  var link = "http://www.tv-asahi.co.jp" + href;

  var YYYYMMDD = href.substr(13, 8);

  var YYYY = parseInt( YYYYMMDD.substr(0, 4), 10 );
  var MM = parseInt( YYYYMMDD.substr(4, 2), 10 ) - 1; // js の month は 0 から;
  var DD = parseInt( YYYYMMDD.substr(6, 2), 10 );

  var hhmm = ( "000" + ( $("span.min", program_td).text().trim() ).replace(/\:/, "") ).substr(-4); // ダサい;

  var hh = parseInt( hhmm.substr(0, 2), 10 );
  var mm = parseInt( hhmm.substr(2, 2), 10 );

  var date = new Date(0);
  date.setFullYear(YYYY);
  date.setMonth(MM);
  date.setDate(DD);
  date.setHours(hh, mm);

  // テレ朝の一日は 6:00 から始まる。jsの一日は 0:00 から始まる;
  if ( 0 <= date.getHours() && date.getHours() < 6 ) {
    date.setDate( date.getDate() + 1 );
  }

  return { date, title, subtitle, outline, link }
};

/*
var xhr = new XMLHttpRequest();

xhr.addEventListener("load",function(ev){
	//結果を表示
	document.getElementById('result').textContent = xhr.response;
});

xhr.open("GET", "https://www.tv-asahi.co.jp/bangumi/index.html");
xhr.send();
*/
