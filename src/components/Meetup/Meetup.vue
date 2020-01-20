<template>
    <v-container>
        <v-row>
            <v-col xs="12">
                <v-card
                        class="mx-auto"
                >
                    <v-img
                            class="white--text align-end"
                            height="200px"
                            :src="meetup.imageUrl"
                            :lazy-src="require(`@/assets/images/Default_Image_Thumbnail.png`)"
                    >
                        <v-card-title>{{ meetup.title }}</v-card-title>
                    </v-img>

                    <v-card-subtitle class="pb-0">{{ meetup.date }}</v-card-subtitle>

                    <v-card-text class="text--primary">
                        <div>{{ meetup.location }}</div>

                        <div>{{ meetup.description }}</div>
                    </v-card-text>
                    <v-card-actions>
                        <v-btn text to="/signin">
                            <v-icon class="primary" left light>arrow_forward</v-icon>
                            Register
                        </v-btn>
                    </v-card-actions>
                </v-card>
            </v-col>
        </v-row>
    </v-container>
</template>
<script>
    export default {
        name : 'Meetup',
        props : ['id'],
        computed : {
            meetup () {
                return this.$store.getters.SingleMeetup(this.id);
            }
        }
    }
</script>
