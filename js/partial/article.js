let $root=$("html, body"),articleShowMore=function(){$("article").each(function(){let t=$(this).attr("id");$("#"+t+" .article-more--link").click(function(){$("#"+t+" .article-content--all").toggle(500),$("#"+t+" .article-content--excerpt").toggle(500),$(this).find(".fa").toggleClass("fa-angle-double-down"),$(this).find(".fa").toggleClass("fa-angle-double-up"),$root.animate({scrollTop:$("#"+t).offset().top},500,function(){window.location.hash=t})})})};export default articleShowMore;