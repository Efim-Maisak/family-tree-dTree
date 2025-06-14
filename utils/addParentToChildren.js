import { pb } from "../services/pocketbase-service.js";


const addParentToChildren = async (currentNode, newParent, genealogyData) => {

  const batch = pb.createBatch();
  const parent = genealogyData.find(person => person.id === currentNode.parents?.parents[0]);
  const children = parent.children?.children;

  let parentsArr = currentNode.parents?.parents;
  const updatedParentsArr = [...parentsArr, newParent.id];

  for (const child of children) {
        batch.collection("genealogy").update(child,
        { parents: { parents: updatedParentsArr }},
        { requestKey: `${child}` });
  };

  try {
    await batch.send();
  } catch (e) {
      console.error("Ошибка при добавлении родителей детям (pb batch): ", e);
    throw e;
  }

};


export default addParentToChildren;