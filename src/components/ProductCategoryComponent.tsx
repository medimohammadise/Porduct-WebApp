import * as React from "react";
import MaterialTable, { Column } from "material-table";
import useProductCategoryService from "../services/ProductCategory.Service";
import usePostProductCategoryService from "../services/ProductCategory.Post.Service";
import { IProductCategory } from "../data/produtCategory.model";
import { RestOperation } from "../actions/Service.Actions";
import Input from "@material-ui/core/Input";
import Select from "@material-ui/core/Select";
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
                return (
                  <Select
                    native={true}
                    defaultValue={rowData.productCategoryId}
                    input={<Input id="grouped-native-select" />}
                  >
                    <option value="" />

                    <optgroup label="Category 1">
                      {service.status === "loaded" &&
                        service.payload.map((item: any) => (
                          <option value={item.id} key={item.id}>
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
                      {service.status === "loaded" &&
                        service.payload.map((item: any) => (
                          <option value={item.id} key={item.id}>
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
