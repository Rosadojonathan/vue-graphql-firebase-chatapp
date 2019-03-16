<template>
<div id="app" class="container" style="padding-top:100px">
  <div class="row justify-content-center">
    <div class="col-md-8">
      <div class="card">
        <div class="card-body">
          <div class="row" v-if="entered">
            <div class="col-md-12">
              <div class="card">
                <b class="card-header">Chat with anyone</b>
                <div class="card-body">
                  <dl 
                    v-for="(chat, id) in chats"
                    :key="id"
                    class="message"
                    :class="chat.from === username ? 'yourMessage': 'otherUserMessage'"
                  >
                    <dt>{{ chat.from}}</dt>
                    <dd>{{chat.message}} </dd>
                  </dl>
                  <hr>
                    <div>
                      <i class="material-icons" style="float:right;font-size:36px;" >chat</i>
                      <input
                        type="text"
                        class="form-control pull-right"
                        placeholder="Message..."
                        style="float:right;width:88%;margin-right:5px;"
                        v-model="message"
                        @keyup.enter="sendMessage"
                      >
                    </div>
                </div>
              </div>
            </div>
          </div>
          <div class="row" v-else>
            <div class="col-md-12">
              <form method="post" @submit.prevent="enterChat">
                <div class="form-group">
                  <div class="input-group">
                    <input type="text" class="form-control" placeholder="Enter your username..." v-model="username">
                    <div class="input-group-append">
                      <button class="btn btn-primary" @click="enterChat">Enter</button>
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
</template>


<script>
import { CHATS_QUERY, SEND_MESSAGE_MUTATION, MESSAGE_SENT_SUBSCRIPTION } from '@/graphql';
export default {
  name: 'app',
  data() {
    return {
      username: '',
      message: '',
      entered: false,
    };
  },
  apollo: {
    chats: {
      query: CHATS_QUERY,
      subscribeToMore: {
        document: MESSAGE_SENT_SUBSCRIPTION,
        updateQuery: (previousData, {subscriptionData }) => {
          return {
            chats: [...previousData.chats, subscriptionData.data.messageSent],
          };
        },
      },
    },
  },
  methods: {
    enterChat(){
      this.entered = !!this.username != '';
    },
    async sendMessage(){
      const message = this.message;
      this.message = "";

      await this.$apollo.mutate({
        mutation: SEND_MESSAGE_MUTATION,
        variables: {
          from: this.username,
          message,
        },
      });
    },
    isUserMessage(username){
      return { yourMessage: this.username === username,
                otherUserMessage: this.username === username}
    },
  },
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
.message {
  border-radius:15px;
  width:75%;
   padding:4px;
}
.otherUserMessage {
  background-color:rgba(0,0,0,.03);
}
.yourMessage {
  background-color:#2e547d;
  color:white;
  margin-left:auto;
  margin-right:0;

}
</style>
