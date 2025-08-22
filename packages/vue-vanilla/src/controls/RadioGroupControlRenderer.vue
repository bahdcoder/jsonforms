<template>
  <control-wrapper
    v-bind="controlWrapper"
    :styles="styles"
    :is-focused="isFocused"
    :applied-options="appliedOptions"
  >
    <fieldset :class="styles.control.radio?.root">
      <legend v-if="control.label" :class="styles.control.radio?.legend">
        {{ control.label }}
      </legend>
      <div
        v-for="optionElement in control.options"
        :key="optionElement.value"
        :class="styles.control.radio?.option"
      >
        <input
          :id="control.id + '-input-' + optionElement.value"
          type="radio"
          :name="control.id + '-radio-group'"
          :class="styles.control.radio?.input"
          :value="optionElement.value"
          :checked="control.data === optionElement.value"
          :disabled="!control.enabled"
          :autofocus="appliedOptions.focus && optionElement.value === control.options[0]?.value"
          @change="onChange"
          @focus="isFocused = true"
          @blur="isFocused = false"
        />
        <label
          :for="control.id + '-input-' + optionElement.value"
          :class="styles.control.radio?.label"
        >
          {{ optionElement.label }}
        </label>
      </div>
    </fieldset>
  </control-wrapper>
</template>

<script lang="ts">
import {
  ControlElement,
  JsonFormsRendererRegistryEntry,
  rankWith,
  isEnumControl,
  and,
  optionIs,
} from '@jsonforms/core';
import { defineComponent } from 'vue';
import {
  rendererProps,
  useJsonFormsEnumControl,
  RendererProps,
} from '../../config/jsonforms';
import { default as ControlWrapper } from './ControlWrapper.vue';
import { useVanillaControl } from '../util';

const controlRenderer = defineComponent({
  name: 'RadioGroupControlRenderer',
  components: {
    ControlWrapper,
  },
  props: {
    ...rendererProps<ControlElement>(),
  },
  setup(props: RendererProps<ControlElement>) {
    return useVanillaControl(useJsonFormsEnumControl(props), (target) =>
      target.value
    );
  },
});

export default controlRenderer;

export const entry: JsonFormsRendererRegistryEntry = {
  renderer: controlRenderer,
  tester: rankWith(20, and(isEnumControl, optionIs('format', 'radio'))),
};
</script>
