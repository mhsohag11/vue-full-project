<template>
    <v-container>
        <v-row>
            <v-col   xs="12" sm="6" md="4" v-for="meetup in meetups" :key="meetup.id">
                <v-card
                        class="mx-auto"
                        max-width="400"
                >
                    <v-img
                            class="white--text align-end"
                            height="200px"
                            :src="meetup.imageUrl"
                            :lazy-src="require(`@/assets/images/Default_Image_Thumbnail.png`)"
                    >
                        <v-card-title>{{ meetup.title }}</v-card-title>
                    </v-img>

                    <v-card-subtitle class="pb-0">{{ meetup.date }} - {{meetup.time}}</v-card-subtitle>


                    <v-card-actions>
                        <v-btn text :to="'/meetup/' + meetup.id">
                            <v-icon left light>arrow_forward</v-icon>
                            View Meetup
                        </v-btn>
                    </v-card-actions>
                </v-card>
            </v-col>
        </v-row>
    </v-container>
</template>

<script>
    export default {
        name : 'Meetups',
        computed : {
            meetups () {
                return this.$store.getters.sortedMeetupByDate;
            }
        }
    }
</script>