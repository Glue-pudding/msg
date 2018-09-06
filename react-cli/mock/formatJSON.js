var loopChild = function(node){
	node.map((item,index)=>{
			if(item.content){var iContent=JSON.parse(item.content); console.log(iContent.url.replace('$prefix$',''))}
		if(item.children.length){
			loopChild(item.children);
		}
	})
}
// loopChild(iJson.docs)