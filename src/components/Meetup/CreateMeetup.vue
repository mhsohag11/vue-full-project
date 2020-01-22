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
                    <v-btn class="primary" @click="onClickFile">Upload Image</v-btn>
                    <input
                            type="file"
                            style="display: none;"
                            ref="fileInputOriginal"
                            accept="image/*"
                            @change="onFilePicked"
                    >
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
                <v-col class="col-sm-6 col-md-9 col-xs-12 offset-sm-3 offset-md-1">
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
                <v-col class="col-sm-2 col-xs-12 offset-sm-1">
                    <v-btn @click="onCreateupAction" class="primary" :disabled="!ifFilled">Create Meetup</v-btn>
                </v-col>
                <v-col class="col-sm-6 col-xs-12 offset-sm-1" v-if="uploadVal">
                    <v-progress-linear
                            :value="uploadVal"
                            height="25"
                    >
                        <strong>{{uploadVal}}%</strong>
                    </v-progress-linear>
                    <span>{{ uploadStatus }}</span>
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
            image: null,
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
            },
            uploadVal () {
                return this.$store.getters.uploadVal
            },
            uploadStatus () {
                return this.$store.state.uploadStatus
            }
        },
        methods : {
            onCreateupAction () {
                if (!this.ifFilled) false;
                const meetup = {
                    title : this.meetupTitle,
                    location : this.location,
                    image : this.image,
                    description : this.description,
                    date : this.picker,
                    time : this.timePicker,
                }
                this.$store.dispatch('createNewMeetup', meetup)

            },
            onClickFile () {
                this.$refs.fileInputOriginal.click()
            },
            onFilePicked (event) {
                const files = event.target.files //native js
                let filename = files[0].name //native js
                if (filename.lastIndexOf('.') <= 0 ) {
                    return alert('Invalid Image')
                }
                const fileReaderMyDom = new FileReader()
                fileReaderMyDom.readAsDataURL(files[0])
                fileReaderMyDom.addEventListener('load' , (myImgData) => {
                    //myImgData return all value of uploaded image
                    // this.imageUrl = fileReaderMyDom.result
                    this.imageUrl = myImgData.target.result
                })

                this.image = files[0]

            }
        },
        watch : {
            uploadVal (val) {
                if (!val) {
                    return this.$store.getters.uploadVal
                }
                if (val == 100) {
                    return this.$router.push('/meetups')
                }
            },
        }
    }
</script>