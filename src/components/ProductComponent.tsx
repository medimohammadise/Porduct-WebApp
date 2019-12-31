import * as React from "react";
import MaterialTable, { Column } from "material-table";
import useProductsService from "../services/Product.Service";
import useProductsPostService from "../services/Product.Post.Service";
import { IProduct } from "src/data/produt.model";
import { RestOperation } from "../actions/Service.Actions";

interface ITableState {
  columns: Array<Column<IProduct>>;
  data: IProduct[];
}
const ProductComponent: React.FC<{}> = () => {
  const service = useProductsService();
  const { publishProduct } = useProductsPostService();
  const [state, setState] = React.useState<ITableState>({
    columns: [
      { title: "Code", field: "code" },
      { title: "Description", field: "description" },
      { title: "Price", field: "price", type: "numeric" },
      {
        title: "currency",
        field: "currency"
      },
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
          title="Product"
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
                    publishProduct(newData, RestOperation.POST);

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
                      publishProduct(newData, RestOperation.PUT);
                      return { ...prevState, data };
                    });
                  }
                }, 600);
              }),
            onRowDelete: oldData =>
              new Promise(resolve => {
                setTimeout(() => {
                  resolve();
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

export default ProductComponent;
