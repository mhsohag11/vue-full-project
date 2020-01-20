<template>
    <v-container>
        <form action="">
            <v-row>
                <v-col class="col-sm-6 offset-sm-3">
                    <h2>Create New Meet Up</h2>
                </v-col>
            </v-row>
            <v-row>
                <v-col class="col-sm-6 col-md-10 col-xs-12 offset-sm-3 offset-md-1">
                    <v-text-field
                            v-model="meetupTitle"
                            label="Meet Up Title"
                            name="meetupTitle"
                            placeholder="Meetup Title"
                            outlined
                            shaped
                            required
                    ></v-text-field>
                </v-col>
            </v-row>
            <v-row>
                <v-col class="col-sm-6 col-md-10 col-xs-12 offset-sm-3 offset-md-1">
                    <v-text-field
                            v-model="location"
                            label="Meet Up Location"
                            name="meetupTitle"
                            placeholder="Meetup Up Location"
                            outlined
                            shaped
                            required
                    ></v-text-field>
                </v-col>
            </v-row>
            <v-row>
                <v-col class="col-sm-6 col-md-10 col-xs-12 offset-sm-3 offset-md-1">
                    <v-text-field
                            v-model="imageUrl"
                            label="Upload Meetup Image"
                            name="imageUrl"
                            required
                    ></v-text-field>
                </v-col>
            </v-row>
            <v-row>
                <v-col class="col-sm-6 col-md-10 col-xs-12 offset-sm-3 offset-md-1">
                    <img class="offset-md-2" :src="imageUrl" alt="" style="max-height: 300px">
                </v-col>
            </v-row>
            <v-row>
                <v-col class="col-sm-6 col-xs-12" align="right">
                    <v-date-picker v-model="picker"></v-date-picker>
                </v-col>
                <v-col class="col-sm-6 col-xs-12">
                    <v-time-picker v-model="timePicker" scrollable></v-time-picker>
                </v-col>
            </v-row>
            <v-row>
                <v-col class="col-sm-6 col-md-10 col-xs-12 offset-sm-3 offset-md-1">
                    <v-textarea
                            v-model="description"
                            label="Meet Up Description"
                            class="mx-2"
                            rows="5"
                            outlined
                            shaped
                    ></v-textarea>
                </v-col>
            </v-row>
            <v-row>
                <v-col class="col-sm-6 col-md-10 col-xs-12 offset-sm-3 offset-md-1">
                    <v-btn @click="onCreateupAction" class="primary" :disabled="!ifFilled">Create Meetup</v-btn>
                </v-col>
            </v-row>
        </form>
    </v-container>
</template>
<script>
    export default {
        data: () => ({
            meetupTitle: '',
            location: '',
            imageUrl: '',
            description: '',
            picker: new Date().toISOString().substr(0, 10),
            timePicker: '11:15',
        }),
        computed : {
            ifFilled () {
                return this.meetupTitle !== '' &&
                        this.location !== '' &&
                        this.imageUrl !== '' &&
                        this.description !== '' &&
                        this.picker !== '' &&
                        this.timePicker !== ''
            }
        },
        methods : {
            onCreateupAction () {
                if (!this.ifFilled) false;
                const meetup = {
                    title : this.meetupTitle,
                    location : this.location,
                    imageUrl : this.imageUrl,
                    description : this.description,
                    date : this.picker,
                    time : this.timePicker,
                };
                this.$store.dispatch('createNewMeetup', meetup);
                this.$router.push('/meetups');
            }
        }
    }
</script>