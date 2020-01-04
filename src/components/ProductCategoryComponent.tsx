import * as React from "react";
import MaterialTable, { Column } from "material-table";
import useProductCategoryService from "../services/ProductCategory.Service";
import usePostProductCategoryService from "../services/ProductCategory.Post.Service";
import { IProductCategory } from "../data/produtCategory.model";
import { RestOperation } from "../actions/Service.Actions";
import TreeView from "@material-ui/lab/TreeView";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import TreeItem from "@material-ui/lab/TreeItem";
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
interface ITableState {
  columns: Array<Column<IProductCategory>>;
  data: IProductCategory[];
  title: string;
}
const ProductCatgoryComponent: React.FC<{}> = () => {
  const service = useProductCategoryService();
  const { publishProductCategory } = usePostProductCategoryService();
  const [state, setState] = React.useState<ITableState>({
    columns: [],
    data: [],
    title: "Category"
  });
  const [expanded, setExpanded] = React.useState<string[]>([]);
  const [activeItemId, setActiveItemId] = React.useState<string[]>([]);

  const handleChange = (event: React.ChangeEvent<{}>, nodes: string[]) => {
    console.log("node toggled");
    setExpanded(nodes);
  };

  const renderLabel = (item: any, activeNode: any) => (
    <Box
      display="flex"
      onClick={event => {
        setActiveItemId(item.id);
        event.stopPropagation();
        event.preventDefault();
      }}
    >
      <Typography color={item.id === activeNode ? "primary" : "inherit"}>
        {item.name}
      </Typography>
    </Box>
  );

  const renderItem = (item: any, activeNode: any) => {
    return (
      <TreeItem
        key={item.id}
        nodeId={item.id}
        label={renderLabel(item, activeNode)}
        onKeyDown={event => {
          if (event.keyCode === 13) {
            setActiveItemId(item.id);
            event.stopPropagation();
          }
        }}
      >
        {item.productCategoryIds && item.productCategoryIds.length > 0
          ? item.productCategoryIds.map(renderItem)
          : null}
      </TreeItem>
    );
  };
  return (
    <>
      {service.status === "loaded" && (
        <MaterialTable
          title={state.title}
          columns={[
            { title: "Id", field: "id", hidden: true },
            { title: "Code", field: "code" },
            { title: "Name", field: "name" },
            {
              title: "Category",
              field: "productCategoryId",
              render: rowData => {
                if (service.status === "loaded") {
                  console.log(rowData.id);
                  // setActiveItemId(rowData.id);
                }
                return (
                  <TreeView
                    defaultCollapseIcon={<ExpandMoreIcon />}
                    defaultExpandIcon={<ChevronRightIcon />}
                    onNodeToggle={handleChange}
                    expanded={[rowData.productCategoryId]}
                  >
                    {service.status === "loaded" &&
                      service.payload
                        .filter((item: any) => item.productCategoryId == null)
                        .map((item: any) => {
                          return renderItem(item, rowData.productCategoryId);
                        })

                    /* service.payload.map(
                        
                       (item: any) =>
                          item.parentCategoryId == null && (
                            <TreeItem nodeId={item.id} label={item.name}>
                              {item.productCategoryIds.map(
                                (childItems: any) => (
                                  <TreeItem
                                    nodeId={childItems.id}
                                    label={childItems.name}
                                  />
                                )
                              )}
                            </TreeItem>
                          )
                      )*/
                    }
                  </TreeView>
                );
              },
              editComponent: props => {
                return (
                  <TreeView
                    defaultCollapseIcon={<ExpandMoreIcon />}
                    defaultExpandIcon={<ChevronRightIcon />}
                    expanded={expanded}
                    onNodeToggle={handleChange}
                  >
                    {service.status === "loaded" &&
                      service.payload
                        .filter((item: any) => item.productCategoryId == null)
                        .map(renderItem)
                    /* service.payload.map(
                        
                       (item: any) =>
                          item.parentCategoryId == null && (
                            <TreeItem nodeId={item.id} label={item.name}>
                              {item.productCategoryIds.map(
                                (childItems: any) => (
                                  <TreeItem
                                    nodeId={childItems.id}
                                    label={childItems.name}
                                  />
                                )
                              )}
                            </TreeItem>
                          )
                      )*/
                    }
                  </TreeView>
                );
              }
            }
          ]}
          onTreeExpandChange={(data, isExpanded) => console.log(data)}
          data={service.payload}
          editable={{
            onRowAdd: newData =>
              new Promise(resolve => {
                setTimeout(() => {
                  resolve();
                  setState(prevState => {
                    const data = [...prevState.data];
                    data.push(newData);
                    newData.productCategoryId = activeItemId;
                    publishProductCategory(RestOperation.POST, newData);

                    return { ...prevState, data };
                  });
                }, 600);
              }),
            onRowUpdate: (newData, oldData) =>
              new Promise(resolve => {
                setTimeout(() => {
                  resolve();
                  if (oldData) {
                    setState(prevState => {
                      const data = [...prevState.data];
                      data[data.indexOf(oldData)] = newData;
                      newData.productCategoryId = activeItemId;
                      publishProductCategory(RestOperation.PUT, newData);
                      return { ...prevState, data };
                    });
                  }
                }, 600);
              }),
            onRowDelete: oldData =>
              new Promise(resolve => {
                setTimeout(() => {
                  resolve();
                  publishProductCategory(
                    RestOperation.DELETE,
                    null,
                    oldData.id
                  );
                  setState(prevState => {
                    const data = [...prevState.data];
                    data.splice(data.indexOf(oldData), 1);
                    return { ...prevState, data };
                  });
                }, 600);
              })
          }}
        />
      )}
    </>
  );
};

export default ProductCatgoryComponent;
