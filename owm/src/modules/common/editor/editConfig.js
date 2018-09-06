const commConfig = {
    uiColor:'#FFFFFF',
    startupFocus:true,
    fontSize_sizes:'12px;13px;14px;16px;18px;20px;24px;32px;40px;48px;',
    font_names:'宋体;新细明体;仿宋;微软雅黑;隶属;幼圆;华文楷体;方正舒体;华文行楷;楷体;黑体;'+
    'Arial/Arial, Helvetica, sans-serif;' +
    'Times New Roman/Times New Roman, Times, serif;' +
    'Verdana',
}
export const InlineConfig={
    ...commConfig,
    extraPlugins:'colorbutton,font',
    toolbarGroups:[
        {name:'colors',groups:["colors"]},
        { name: 'basicstyles', groups: [ 'basicstyles' ] },
        { name: 'styles', groups: [ "font","fontSize"] },
    ],
    removeButtons:"Italic,Strike,Subscript,Superscript,Underline,Bold,Styles,BGColor,Format"
};
export const ClassicConfig ={
    ...commConfig,
    extraPlugins:'colorbutton,font',
    toolbarGroups:[
		{ name: 'document', groups: [ 'mode', 'document', 'doctools' ] },
        {name:'colors',groups:["colors"]},
		{ name: 'insert', groups: [ 'insert' ] },
        { name: 'basicstyles', groups: [ 'basicstyles','cleanup' ] },
		{ name: 'paragraph', groups: [ 'list',  'bidi', 'paragraph' ] },
        { name: 'styles', groups: [ "font","fontSize"] },
    ],
}