import cytoscape from "cytoscape";
import coseBilkent from "cytoscape-cose-bilkent";
import edgehandles from "cytoscape-edgehandles";

// Register Cytoscape extensions only once
if (!cytoscape.prototype.hasInitialized) {
  cytoscape.use(coseBilkent);
  cytoscape.use(edgehandles);
  cytoscape.prototype.hasInitialized = true;
}

export default cytoscape; 