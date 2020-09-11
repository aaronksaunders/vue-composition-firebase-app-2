import { toRefs, reactive, onMounted } from "@vue/composition-api";
import firebase from "firebase";
// Required for side-effects
import "firebase/firestore";

/**
 *
 * @param { String } collectionName name of the desired collection
 * @param { object } queryOptions
 * @param { boolean | undefined } queryOptions.onMounted if true run query on mount
 * @param { string | undefined } queryOptions.query query string, see firebase documentation
 * @param { string | undefined } queryOptions.orderBy order results,  string, see firebase documentation
 * @param { number | undefined } queryOptions.limit number of object to return,  string, see firebase documentation
 */
export default function(store, collectionName, queryOptions) {
  let state = reactive({
    // error if one happens
    error: null,
    // the results of the query
    collectionData: {},
    // if the query is loading or ot
    loading: false
  });

  // get the database
  let db = firebase.firestore();

  /**
   * there is the option to load the query when the component
   * is mounted, you need to set the option in the `queryOptions`
   * params that you pass in
   *
   */
  onMounted(() => {
    queryOptions && queryOptions.onMount && getCollection();
  });

  /**
   *
   * @param { object } queryOptions
   * @param { boolean | undefined } queryOptions.onMounted
   * @param { string | undefined } queryOptions.query
   * @param { string | undefined } queryOptions.orderBy
   * @param { number | undefined } queryOptions.limit
   */
  const getCollection = ({ query, orderBy, limit } = queryOptions) => {
    state.loading = true;
    state.error = null;

    let resultArray = [];
    let theQuery = query
      ? db.collection(collectionName).where(_query)
      : db.collection(collectionName);

    theQuery = limit ? theQuery.limit(limit) : theQuery;
    theQuery = orderBy ? theQuery.orderBy(orderBy) : theQuery;

    return theQuery
      .get()
      .then(querySnapshot => {
        querySnapshot.forEach(doc => {
          resultArray.push({ id: doc.id, ...doc.data() });
        });
        state.collectionData = resultArray;
        state.error = null;

        // updatet the store
        store.dispatch("loadThings", resultArray);
        return { data: resultArray };
      })
      .catch(error => {
        console.log("Error getCollection: ", error);
        state.error = error;

        // updatet the store
        store.dispatch("error", error);
        return { error };
      })
      .finally(() => {
        state.loading = false;
      });
  };

  return {
    ...toRefs(state),
    getCollection: getCollection
  };
}
