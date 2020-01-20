<template>
    <v-form>
        <v-container>
            <h2 align="center">Sign Up Here</h2>
            <v-row align="center" class="justify-center">
                <v-overlay :value="loading">
                    <v-progress-circular indeterminate size="64"></v-progress-circular>
                </v-overlay>
                <v-col cols="12" sm="9" md="6">
                    <app-alert v-if="error" @dismissed="closeError" :text="error.message"></app-alert>
                    <v-text-field
                            v-model="firstName"
                            label="First Name"
                            outlined
                            shaped
                            @click="closeError"
                            :rules="[rules.required]"
                    ></v-text-field>
                    <v-text-field
                            v-model="lastName"
                            label="Last Name"
                            outlined
                            shaped
                            @click="closeError"
                            :rules="[rules.required]"
                    ></v-text-field>
                    <v-text-field
                            v-model="email"
                            label="Email"
                            outlined
                            shaped
                            @click="closeError"
                            :rules="[rules.required, rules.email]"
                    ></v-text-field>
                    <v-text-field
                            v-model="password"
                            :append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
                            :rules="[rules.required, rules.min]"
                            :type="show1 ? 'text' : 'password'"
                            name="password"
                            label="Password"
                            hint="At least 6 characters"
                            counter
                            outlined
                            shaped
                            @click="closeError"
                            @click:append="show1 = !show1"
                    ></v-text-field>
                    <v-text-field
                            v-model="confirmPass"
                            :append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
                            :rules="[rules.required, passMatch]"
                            :type="show1 ? 'text' : 'password'"
                            name="confirmPass"
                            label="Confirm Password"
                            outlined
                            shaped
                            @click="closeError"
                            @click:append="show1 = !show1"
                    ></v-text-field>
                    <v-btn :disabled="!singUpButtonShow" @click="signUpAction" class="primary">Sign Up</v-btn>
                </v-col>
            </v-row>
        </v-container>
    </v-form>
</template>

<script>
    export default {
        data () {
            return {
                firstName: '',
                lastName: '',
                email: '',
                rules: {
                    required: value => !!value || 'Required.',
                    email: value => {
                        const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
                        return pattern.test(value) || 'Invalid e-mail.'
                    },
                    min: v => v.length >= 6 || 'Min 6 characters',
                },
                show1: false,
                password: '',
                confirmPass: '',
            }
        },
        computed : {
            passMatch () {
                return (this.password==this.confirmPass) ? true : 'Password doesn\'t match';
            },
            singUpButtonShow () {
                return this.firstName !== '' &&
                        this.lastName !== '' &&
                        this.email !== '' &&
                        this.password.length >= 6 &&
                        this.passMatch == true
            },
            error () {
                return this.$store.getters.error
            },
            loading () {
                return this.$store.getters.loading
            }
        },
        methods : {
            signUpAction () {
                this.$store.dispatch('doActionForSignup', { email: this.email, password: this.confirmPass })
            },
            closeError () {
                this.$store.commit('clearError')
            },

        },
        created() {
            this.$store.commit('clearError')
        }
    }
</script>