<template>
  <div id="app">
    <img src="./assets/logo.png" style="width:100%; padding:20px; max-width:500px;">
    <div style="padding:10px; color:#cacaca9d">
      (formerly Silver Novus Research LLC)
    </div>
    <div style="flex:1; padding:10px; display:flex; flex-direction:column; padding-top:20px; padding-bottom:20px; align-items:center">
      <h1 v-for="(item,index) in h1s" :key="index">{{item}}</h1>
      <br>
      <h2 style="color:#cacaca9d" v-for="(item,index) in h2s" :key="index">{{item}}</h2>
      <br><br>
      <h5>SIGN UP TO TRY OUR APPS</h5>
      <div style="padding:10px; width:100%; display:flex; flex-direction:row">
        <b-form-input type="email" placeholder="Enter your email"></b-form-input>
        <div style="padding-left:5px;">
          <b-button variant="dark">SIGN UP</b-button>
        </div>

      </div>
    </div>
  </div>
</template>

<script>
// import HelloWorld from './components/HelloWorld.vue'

export default {
  name: 'App',
  components: {
    //HelloWorld
  },
  data(){
    return {
      h1s:[
        'Preventative',
        'Health Solutions',
        'Spanning Sleep,',
        'Diet, Activity and',
        'Disease',
        'Management'
      ],
      h2s:[
        'AI-driven tools',
        'that make optimizing',
        'your health easier',
        'and more enjoyable'
      ]
    }
  }
}
</script>

<style>
body,html{
  position:absolute;
  top:0px;
  right:0px;
  bottom:0px;
  left:0px;
    background-image: url('./assets/site-background.jpg');
  background-size: cover;
  background-repeat: no-repeat;
}
#app {
  height:100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  color: white;

}
</style>
