import * as React from "react";
import MaterialTable, { Column } from "material-table";
import useProductsService from "../services/Product.Service";
import useProductCategoryService from "../services/ProductCategory.Service";
import useProductsPostService from "../services/Product.Post.Service";
import { IProduct } from "src/data/produt.model";
import { RestOperation } from "../actions/Service.Actions";
import Input from "@material-ui/core/Input";
import Select from "@material-ui/core/Select";
interface ITableState {
  columns: Array<Column<IProduct>>;
  data: IProduct[];
  title: string;
}
const ProductComponent: React.FC<{}> = () => {
  const service = useProductsService();
  const { publishProduct } = useProductsPostService();
  const categoryService = useProductCategoryService();
  const [state, setState] = React.useState<ITableState>({
    columns: [],
    data: [],
    title: "Product"
  });

  return (
    <>
      {service.status === "loaded" && (
        <MaterialTable
          title={state.title}
          columns={[
            { title: "id", field: "id", hidden: true },
            { title: "Code", field: "code" },
            { title: "Description", field: "description" },
            { title: "Price", field: "price", type: "numeric" },
            {
              title: "currency",
              field: "currency"
            },
            {
              title: "Category",
              field: "productCategoryId",
              render: rowData => {
                return (
                  <Select
                    native={true}
                    defaultValue={rowData.productCategoryId}
                    input={<Input id="grouped-native-select" />}
                  >
                    <option value="" />

                    <optgroup label="Category 1">
                      {categoryService.status === "loaded" &&
                        categoryService.payload.map((item: any) => (
                          <option
                            key={item.id}
                            value={item.id}
                            selected={item.id === rowData.productCategoryId}
                          >
                            {item.name}
                          </option>
                        ))}
                    </optgroup>
                  </Select>
                );
              },
              editComponent: props => {
                return (
                  <Select
                    native={true}
                    defaultValue={props.rowData.productCategoryId}
                    input={
                      <Input
                        id="grouped-native-select"
                        onChange={e => props.onChange(e.target.value)}
                      />
                    }
                  >
                    <option value="" />

                    <optgroup label="Category 1">
                      {categoryService.status === "loaded" &&
                        categoryService.payload.map((item: any) => (
                          <option
                            value={item.id}
                            key={item.id}
                            selected={
                              item.id === props.rowData.productCategoryId
                            }
                          >
                            {item.name}
                          </option>
                        ))}
                    </optgroup>
                  </Select>
                );
              }
            }
          ]}
          data={service.payload}
          editable={{
            onRowAdd: newData =>
              new Promise(resolve => {
                setTimeout(() => {
                  resolve();
                  setState(prevState => {
                    const data = [...prevState.data];
                    data.push(newData);
                    publishProduct(RestOperation.POST, newData);

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
                      publishProduct(RestOperation.PUT, newData);
                      return { ...prevState, data };
                    });
                  }
                }, 600);
              }),
            onRowDelete: oldData =>
              new Promise(resolve => {
                setTimeout(() => {
                  resolve();
                  publishProduct(RestOperation.DELETE, null, oldData.id);
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
