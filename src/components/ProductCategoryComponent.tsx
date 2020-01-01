import * as React from "react";
import MaterialTable, { Column } from "material-table";
import useProductCategoryService from "../services/ProductCategory.Service";
import usePostProductCategoryService from "../services/ProductCategory.Post.Service";
import { IProductCategory } from "../data/produtCategory.model";
import { RestOperation } from "../actions/Service.Actions";

interface ITableState {
  columns: Array<Column<IProductCategory>>;
  data: IProductCategory[];
}
const ProductCatgoryComponent: React.FC<{}> = () => {
  const service = useProductCategoryService();
  const { publishProductCategory } = usePostProductCategoryService();
  const [state, setState] = React.useState<ITableState>({
    columns: [
      { title: "Code", field: "code" },
      { title: "Name", field: "name" },
      {
        title: "Category",
        field: "productCategoryId"
      }
    ],
    data: []
  });

  return (
    <>
      {service.status === "loaded" && (
        <MaterialTable
          title="Product Categories"
          columns={state.columns}
          data={service.payload}
          editable={{
            onRowAdd: newData =>
              new Promise(resolve => {
                setTimeout(() => {
                  resolve();
                  setState(prevState => {
                    const data = [...prevState.data];
                    data.push(newData);
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
