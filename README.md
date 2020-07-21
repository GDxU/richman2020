# Game Templates

Nuxt + PixiJS DICE Richman 2020 reworks

Currently is only limited to testing on the frontend only.

### Getting started with Nuxt

- Let's start by adding a `package.json` with the following dependencies:

```json
{
    "name": "nuxt-static",
    "version": "1.0.0",
    "private": true,
    "scripts": {
        "dev": "nuxt",
        "build": "nuxt build",
        "start": "nuxt start",
        "generate": "nuxt generate",
    },
    "dependencies": {
        "cross-env": "^5.2.0",
        "nuxt": "^2.0.0"
    },
    "devDependencies": {
        "nodemon": "^1.11.0"
    }
}
```

- Create a `pages` folder with an `index.vue` file with the following code:

```
<template>
  <section>
    <div>
      <Title/>
      <div class="links">
        <nuxt-link to="/about">About</nuxt-link>
      </div>
    </div>
  </section>
</template>

<script>
import Title from '~/components/Title.vue'

export default {
  components: {
    Title
  }
}
</script>

<style>
.links {
  padding-top: 15px;
}
</style>
```

- Now lets create an `about.vue` file inside the `pages` folder with the following code:

```jsx
<template>
  <section>
    <div>
      <Title/>
      <div class="links">
        <nuxt-link to="/">Go to home</nuxt-link>
      </div>
    </div>
  </section>
</template>

<script>
import Title from '~/components/Title.vue'

export default {
  components: {
    Title
  }
}
</script>

<style>
.links {
  padding-top: 15px;
}
</style>

```

- As you might noticed we have a component that is share by both `index.vue` and `about.vue` files, lets create that one now. Create a folder named `components` with a file named `Title.vue` on it and add the following code:

```jsx
<template>
  <h1>Static Nuxt Example on Now 2.0</h1>
</template>

<style>
h1 {
  font-size: 48px;
}
</style>

```

- Finally in order for Nuxt to be deployed statically we will use the `package.json` and define our build options for Nuxt creating a `nuxt.config.js` with the following code:

```javascript
const pkg = require('./package')

module.exports = {
  mode: 'spa',
  head: {
    title: pkg.name,
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: pkg.description }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ]
  },
  loading: { color: '#fff' }
}

```

### Deploy a Static version to Now

First we need to create a `now.json` configuration file to instruct Now how to build the project.

For this example we will be using our newest version [Now 2.0](https://zeit.co/now).

By adding the `version` key to the `now.json` file, we can specify which Now Platform version to use.

We also need to define each builders we would like to use. [Builders](https://zeit.co/docs/v2/deployments/builders/overview/) are modules that take a deployment's source and return an output, consisting of [either static files or dynamic Lambdas](https://zeit.co/docs/v2/deployments/builds/#sources-and-outputs).

In this case we are going to use `@now/static-build` to build and deploy our Nuxt application selecting the `package.json` as our entry point. We will also define a name for our project (optional).

```json
{
    "version": 2,
    "name": "nuxt-static",
    "builds": [
        { "src": "package.json", "use": "@now/static-build" }
    ]
}
```

Visit our [documentation](https://zeit.co/docs/v2/deployments/configuration) for more information on the `now.json` configuration file.

We also need to include a script in `package.json` named `"now-build"` that specifies what command Now will run on the server to "build" your application. Also notice that we are using `nuxt generate` that will create a folder called `dist` which Now identifies as the static folder.

```json
{
    "scripts": {
        ...
        "now-build": "nuxt generate"
    }
}
```

We are now ready to deploy the app.

```shell
$ now
```

monoploy game with full functions

still need more works to get it done
this is a non-finished game.


#### 提交说明
  大家提交的时候都push到自己的新分支，然后再向`dev` 分支提一个``` New pull request```
  注意仓库的整洁，自己编译生成的非代码文件添加到 ```.ignore```
  
#### 代码规范
 1. 变量名采用全部小写，单词之间加下划线，过长的单词可以写成简写比如前三位或者去掉所有元音字母。比如``` player_curr_pos ```
 2. 函数名单词首字母大写。比如 ```GameStart()```
 3. 宏名全部字母大写，单词之间加下划线。比如 ```CHECK_OUT_PLAYER```
 4. 注意代码重用，较长的写成函数，较短的写成宏。
 5. 注意取名的意义，i，j 之类的变量随用随声明
 6. 所有变量声明在函数开头，``` i,j,k``` 之类除外
 7. 随手写注释，用英文。
 8. 标示写成宏，便于使用，比如 
  ```C
  #define HOSPITAL 'H'    // hospital
#define TOOL 'T'        // tools
#define SPACE '0'       // space
#define GIFT 'G'        // gift house
#define MAGIC 'M'       // magic house
#define PRISON 'P'      // prison
#define MINERAL '$'     // mineral area
#define START 's'       // start area
  ```
 9. 尽量减少代码嵌套的层数。
 
#### Version
##### v0.1.0
**跑起来**
- [x] 游戏进度(是否读取存档)
- [x] 玩家数量,玩家信息
- [x] 地图显示
- [x] 掷骰子
- [ ] 存档   
- [ ] 玩家查询
- [ ] 简单测试

##### v0.2.0
**进阶玩法**
- [ ] 房产买卖
- [ ] 房产升级
- [ ] 收租
- [ ] 破产

##### 0.3.0
**点数购买道具**
- [ ] 矿地点数
- [ ] 道具屋
- [ ] 道具使用
- [ ] 医院

##### 0.4.0
**礼品屋 监狱**
- [ ] 获得礼品
- [ ] 礼品使用
- [ ] 监狱

#### 编译
``` cmake .```

``` make ```

#### 运行
``` ./zillionaire ```

