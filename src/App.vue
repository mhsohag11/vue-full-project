<template>
  <v-app>
    <!--============================
    =======Mobile Menu===========
    ==============================-->
    <v-navigation-drawer v-model="drawer" absolute temporary >
      <v-list-item>
        <v-list-item-content>
          <v-list-item-title>
            <router-link to="/" tag="span" style="cursor: pointer">
              {{ siteTitle }}
            </router-link>
          </v-list-item-title>
        </v-list-item-content>
      </v-list-item>

      <v-divider></v-divider>
      <!--============================
      =======Primary Menus===========
      ==============================-->
      <v-list dense>

        <v-list-item v-for="item in menuItems" :key="item.title" :to="item.link" link>
          <v-list-item-icon>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-icon>

          <v-list-item-content>
            <v-list-item-title>{{ item.title }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <!--============================
    =======Admin Bar Menu===========
    ==============================-->
    <v-navigation-drawer
            class="admin-drawer"
            v-if="isUserLogedIn"
            color="teal"
            :expand-on-hover="expandOnHover"
            :right="right"
            absolute
            dark
            permanent
            :hide-overlay="true"
    >
      <v-list
              dense
              nav
              class="py-0"
      >
        <v-list-item two-line>
          <v-list-item-avatar>
            <img src="https://randomuser.me/api/portraits/men/81.jpg">
          </v-list-item-avatar>

          <v-list-item-content>
            <v-list-item-title>Application</v-list-item-title>
            <v-list-item-subtitle>Subtext</v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>

        <v-divider></v-divider>

        <v-list-item
                v-for="item in items"
                :key="item.title"
                @click="onLogout(item)"
                link
        >
          <v-list-item-icon>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-icon>

          <v-list-item-content>
            <v-list-item-title>{{ item.title }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-toolbar color="teal" dark>
      <v-toolbar-title>
        <router-link to="/" tag="span" style="cursor: pointer">
          {{ siteTitle }}
        </router-link>
      </v-toolbar-title>

      <v-spacer></v-spacer>

      <v-toolbar-items class="hidden-sm-and-down">

        <v-btn v-for="(item , index) in menuItems" text :key="index" :to="item.link"><v-icon left dark>{{ item.icon }}</v-icon>{{ item.title }}</v-btn>

      </v-toolbar-items>
      <v-app-bar-nav-icon class="hidden-md-and-up" @click="drawer = ! drawer"></v-app-bar-nav-icon>
    </v-toolbar>
    <main>
      <router-view></router-view>
    </main>
  </v-app>
</template>

<script>


export default {
  name: 'App',
  computed : {
    siteTitle () {
      return this.$store.state.siteTitle;
    },
    menuItems () {
      let menuItems = [
        { icon: 'face', title: 'Sign up', link: '/signup' },
        { icon: 'lock_open', title: 'Sign in', link: '/signin' }
      ]
      if(this.isUserLogedIn) {
        menuItems = [
          { icon: 'supervisor_account', title: 'View Meetups', link: '/meetups' },
          { icon: 'room', title: 'Organize Meetup', link: '/meetup/new' },
        ]
      }
      return menuItems
    },
    isUserLogedIn () {
      return this.$store.getters.user !== null && this.$store.getters.user !== undefined
    },
  },
  data () {
    return {
      drawer : null,
      items: [
        { title: 'Dashboard', icon: 'mdi-view-dashboard' },
        { title: 'Users', icon: 'person' },
        { title: 'Logout', icon: 'mdi-help-box' , action: 'logout'},
      ],
      right: true,
      expandOnHover: true,
    }
  },
  methods : {
    onLogout (item) {
      if (item.action == 'logout') {
        this.$store.dispatch('logout')
      }
    },
  },
  mounted () {
    this.$store.dispatch('loadedMeetupsFromFirebase')
  }
};
</script>
