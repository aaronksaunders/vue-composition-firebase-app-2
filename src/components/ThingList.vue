<template>
  <div class="hello">
    <div v-for="item in collectionData" :key="item.id">
      <div>
        <button @click="deleteThing(item.id)">DELETE</button>
        &nbsp;
        <div @click="getDocument(item.id)">{{item.name}}&nbsp;{{item.createdOn}}</div>
      </div>
    </div>
    <template v-if="loading">
      <h2>Processing Request...</h2>
    </template>
    <template v-else>
      <button @click="addThing('New Item: ' +new Date())">ADD</button>
    </template>
    <div>
      <h3>Active Item</h3>
      {{documentData}}
    </div>
  </div>
</template>

<script>
// import useThings from "../use-things";
import useThingsCollection from "../use-collection";
import useThingsDocument from "../use-document";
export default {
  name: "ThingList",
  props: {
    collectionName: {
      type: String,
      required: true
    }
  },
  /**
   * pass in the name of the collection into the setup so
   * it can be passed on to the composition function
   */
  setup({ collectionName }) {
    let thingsCollectionProps = useThingsCollection(collectionName, {
      onMounted: false
    });

    let thingsDocumentProps = useThingsDocument(collectionName, {
      onMounted: false
    });
    return {
      // this returns all of the state information and the function from
      // the userThingsCollection
      //
      // error: error if one happens
      // collectionData: the results of the query
      // loading: if the query is loading or not
      // getCollection : function exposed to run query manually
      ...thingsCollectionProps,

      // this returns all of the state information and the function from
      // the useThingsDocument
      ...thingsDocumentProps,

      // catch errors from both composition functions
      error: thingsDocumentProps.error || thingsCollectionProps
    };
  },
  methods: {
    addThing(_name) {
      this.createDocument({ name: _name });
    },
    deleteThing(_id) {
      this.deleteDocument(_id);
    }
  },
  mounted() {
    this.getCollection(/*{ limit: 5 }*/);
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
