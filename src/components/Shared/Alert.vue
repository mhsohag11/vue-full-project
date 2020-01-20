<template>
    <div>
        <v-alert
                @input="onClose"
                :value="true"
                type="error"
                dismissible
        >
            {{ text }}
        </v-alert>

    </div>
</template>
<script>
    export default {
        props : ['text'],
        methods : {
            onClose (){
                this.$emit('dismissed')
            }
        }
    }
</script>
