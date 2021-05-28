# cocos-framework
该项目旨在将ecs框架与cocos3.0+渲染部分进行结合，并新增一套适用于cocos的游戏帮助类。

## 渲染框架介绍
关于渲染，框架有几个子系统（例如渲染器）。这些保证了每个对象可以在基础上进行配置。

框架渲染设置的设计非常易于启动和运行，但同时又非常灵活，以便高级用户可以开箱即用地进行所需的任何操作，渲染系统主要围绕`Renderer`类。你可以将一个或多个渲染你其添加到场景中（`addRenderer`和`removeRenderer`方法）。当所有实体、组件都调用了他们的`update`方法后就会开始执行渲染器。框架提供了默认的渲染器。

- DefaultRenderer：渲染场景中每个`component_render`都会被进行渲染

你可以随意继承`Renderer`并以所需的任何方式渲染。场景中包含一个`renderableComponents`字段，该字段包含所有的`component_render`以便于访问和过滤。

## 渲染截图
![avatar1](/images/screenshot.png)
![avatar2](/images/screenshot1.png)
![avatar3](/images/screenshot2.png)
