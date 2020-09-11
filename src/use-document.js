import { toRefs, reactive, onMounted } from "@vue/composition-api";
import firebase from "firebase";
// Required for side-effects
import "firebase/firestore";

/**
 *
 * @param { String } collectionName name of the desired collection
 * @param { object } queryOptions
 * @param { boolean | undefined } queryOptions.onMounted if true run query on mount
 * @param { string | undefined } queryOptions.documentId query string, see firebase documentation
 */
export default function(store, collectionName, queryOptions) {
  let state = reactive({
    // error if one happens
    error: null,
    // the results of the query
    documentData: {},
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
    queryOptions &&
      queryOptions.onMount &&
      getDocument(queryOptions.documentId);
  });

  const deleteDocument = _documentId => {
    state.loading = true;
    state.error = null;
    return db
      .collection(collectionName)
      .doc(_documentId)
      .delete()
      .then(() => {
        console.log("Document successfully deleted!");
        state.error = null;
        state.documentData = null;

        // update the store
        store.dispatch("deleteThing", _documentId);
        return { id: _documentId };
      })
      .catch(error => {
        console.error("Error removing document: ", error);
        state.error = error;
        state.documentData = null;
        // updatet the store
        store.dispatch("error", error);
        return { error };
      })
      .finally(() => {
        state.loading = false;
      });
  };

  const createDocument = _documentData => {
    state.loading = true;
    state.error = null;

    return db
      .collection(collectionName)
      .add({
        ..._documentData,
        createdOn: firebase.firestore.FieldValue.serverTimestamp()
      })
      .then(docRef => {
        state.error = null;
        state.documentData.id = docRef.id;
        return docRef.get();
      })
      .then(_doc => {
        let document = { id: _doc.id, ..._doc.data() };

        // update the store
        store.dispatch("addThing", document);
        return document;
      })
      .catch(function(error) {
        // The document probably doesn't exist.
        console.error("Error createDocument: ", error);
        state.error = error;
        state.documentData = null;

        // updatet the store
        store.dispatch("error", error);
        return { error };
      })
      .finally(() => {
        state.loading = false;
      });
  };

  const updateDocument = _documentData => {
    state.loading = true;
    state.error = null;

    let data = { ..._documentData };
    delete data[id];

    let docRef = db.collection(collectionName).doc(_documentData.id);

    return docRef
      .update({
        ...data,
        updatedOn: firebase.firestore.FieldValue.serverTimestamp()
      })
      .then(() => {
        state.error = null;
        state.documentData = null;
        return docRef.get();
      })
      .then(_doc => {
        return { id: _doc.id, ..._doc.data() };
      })
      .catch(function(error) {
        // The document probably doesn't exist.
        console.error("Error updating document: ", error);
        state.error = error;
        state.documentData = null;

        // updatet the store
        store.dispatch("error", error);
        return { error };
      })
      .finally(() => {
        state.loading = false;
      });
  };

  /**
   *
   * @param { object } queryOptions
   * @param { boolean | undefined } queryOptions.onMounted
   * @param { string | undefined } queryOptions.documentId
   */
  const getDocument = documentId => {
    state.loading = true;
    state.error = null;

    return db
      .collection(collectionName)
      .doc(documentId)
      .get()
      .then(doc => {
        if (doc.exists) {
          console.log("Document data:", doc.data());
          state.documentData = { id: doc.id, ...doc.data() };
          state.error = null;

          // updatet the store
          store.dispatch("setCurrentThing", state.documentData);

          return state.documentData;
        } else {
          // doc.data() will be undefined in this case
          console.log("No such document!: " + documentId);
          state.documentData(null);
          state.error = null;
          return null;
        }
      })
      .catch(error => {
        console.log("Error getDocuent: ", error);
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
    getDocument: getDocument,
    createDocument,
    updateDocument,
    deleteDocument
  };
}
