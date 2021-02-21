<template lang="pug">
  .custom-checkbox(@click="v = !v")
    check-icon(v-if="v" :size="size")
</template>

<script lang="ts">
import CheckIcon from 'vue-material-design-icons/Check.vue';
import {
  Vue,
  Component,
  Prop,
} from 'vue-property-decorator';

@Component({
  name: 'Checkbox',
  components: {
    CheckIcon,
  },
})
export default class Checkbox extends Vue {
  @Prop({ required: true }) value!: boolean;

  @Prop({ default: () => 50 }) size!: number;

  get v(): boolean {
    return this.value;
  }

  set v(v: boolean) {
    this.$emit('input', v);
  }
}
</script>

<style lang="scss">
 .custom-checkbox {
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 50%;
    border: 1px solid lightgray;
    min-width: 30px;
    min-height: 30px;
    margin-right: 10px;
    color: #5dc2af;
    font-size: 28px;

    .material-design-icon {
      transform: rotate(-11deg);
    }
  }
</style>
