<template>
  <div>
    <div v-for="item in $store.state.things" :key="item.id">
      <div class="item-wrapper">
        <div @click="getDocument(item.id)">
          <div>{{item.name}}</div>
          &nbsp;{{item.createdOn.toDate()}}
        </div>&nbsp;
        <button @click="deleteThing(item.id)">DELETE</button>
      </div>
    </div>
    <template v-if="loading">
      <h2>Processing Request...</h2>
    </template>
    <template v-else>
      <div class="button-wrapper">
        <button @click="addThing('New Item: ' + new Date().getTime() )">ADD NEW ITEM</button>
      </div>
    </template>
    <div>
      <h3>Active Item</h3>
      {{$store.state.currentDocument}}
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
  setup({ collectionName }, { root }) {
    // console.log(root.$store);
    let thingsCollectionProps = useThingsCollection(
      root.$store,
      collectionName,
      {
        onMounted: false
      }
    );

    let thingsDocumentProps = useThingsDocument(root.$store, collectionName, {
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
      //
      // error: error if one happens
      // documentData: the results of the query
      // loading: if the query is loading or not
      // createDocument : function exposed to run against collection
      // deleteDocument : function exposed to run against collection
      // addDocument : function exposed to run against collection
      ...thingsDocumentProps,

      // catch errors from both composition functions
      error: thingsDocumentProps.error || thingsCollectionProps.error
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
    this.loading = true;
    this.getCollection(/*{ limit: 5 }*/).then(() => {
      this.loading = false;
    });
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.button-wrapper {
  padding: 10px;
}
.item-wrapper {
  padding: 4px;
  margin-bottom: 4px;
  border-bottom: 1px solid lightgray;
}
</style>
