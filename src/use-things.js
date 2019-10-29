import { toRefs, reactive } from "@vue/composition-api";

export default function() {
  let data = reactive({
    things: ["Aaron"],
    loading: false
  });

  const addThing = _value => {
    data.loading = true;
    // fake async call...
    setTimeout(() => {
      data.things = [_value, ...data.things];
      data.loading = false;
    }, 1000);
  };

  const deleteThing = _value => {
    data.loading = true;
    // fake async call...
    setTimeout(() => {
      let newArray = data.things.filter(i => i !== _value);
      data.things = newArray;
      data.loading = false;
    }, 1000);
  };

  return {
    ...toRefs(data),
    addThing,
    deleteThing
  };
}
