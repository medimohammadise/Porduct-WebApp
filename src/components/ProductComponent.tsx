import * as React from "react";
import MaterialTable, { Column } from "material-table";
import useProductsService from "../services/Product.Service";
import useProductCategoryService from "../services/ProductCategory.Service";
import useProductsPostService from "../services/Product.Post.Service";
import useExchangeCurrenyService from "../services/Exchange.Service";
import { IProduct, Currency } from "src/data/produt.model";
import { RestOperation } from "../actions/Service.Actions";
import Input from "@material-ui/core/Input";
import Select from "@material-ui/core/Select";
import StompClient from "react-stomp-client";
import TextField from "@material-ui/core/TextField";
import { IExchnageRate } from "src/data/rate.exchange.model";
import FormControl from "@material-ui/core/FormControl";
import TreeView from "@material-ui/lab/TreeView";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import TreeItem from "@material-ui/lab/TreeItem";
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";

interface ITableState {
  columns: Array<Column<IProduct>>;
  data: IProduct[];
  title: string;
}

const ProductComponent: React.FC<{}> = () => {
  const service = useProductsService();
  const { publishProduct } = useProductsPostService();
  const categoryService = useProductCategoryService();
  const { exchangeService } = useExchangeCurrenyService();
  const [state, setState] = React.useState<ITableState>({
    columns: [],
    data: [],
    title: "Product"
  });

  const [currencyRate, setCurrencyRate] = React.useState<IExchnageRate>({});
  const [selectedCurrency, setSelectedCurrency] = React.useState<string>();

  const [expanded, setExpanded] = React.useState<string[]>([]);
  const [activeItemId, setActiveItemId] = React.useState<string[]>([]);

  React.useEffect(() => {
    if (selectedCurrency) {
      exchangeService("EUR", selectedCurrency, 10);
    }
  }, [selectedCurrency]);

  React.useEffect(() => {
    console.log(currencyRate.convertedValue);
  }, [currencyRate]);

  const handleChange = (event: React.ChangeEvent<{}>, nodes: string[]) => {
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
      {service.status === "loaded" && categoryService.status === "loaded" && (
        <MaterialTable
          title={state.title}
          columns={[
            { title: "id", field: "id", hidden: true },
            { title: "Code", field: "code" },
            { title: "Description", field: "description" },
            { title: "Price", field: "price", type: "numeric" },
            {
              title: "currency",
              field: "currency",
              editComponent: props => {
                return (
                  <Input
                    defaultValue="EUR"
                    value={props.rowData.currency}
                    readOnly={true}
                  />
                );
              }
            },
            {
              title: "Category",
              field: "productCategoryId",
              type: "string",
              render: rowData => {
                return (
                  <TreeView
                    defaultCollapseIcon={<ExpandMoreIcon />}
                    defaultExpandIcon={<ChevronRightIcon />}
                    onNodeToggle={handleChange}
                    expanded={[rowData.productCategoryId]}
                  >
                    {categoryService.status === "loaded" &&
                      categoryService.payload
                        .filter((item: any) => item.productCategoryId == null)
                        .map((item: any) => {
                          return renderItem(item, rowData.productCategoryId);
                        })}
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
                    {categoryService.status === "loaded" &&
                      categoryService.payload
                        .filter((item: any) => item.productCategoryId == null)
                        .map(renderItem)}
                  </TreeView>
                );
              }
            },
            {
              title: "To",

              render: rowData => {
                return (
                  <FormControl>
                    <Select
                      native={true}
                      input={<Input id="currencyListForExchange" />}
                      onChange={e => {
                        setSelectedCurrency(e.target.value as string);
                      }}
                    >
                      <option key="" />
                      {Object.keys(Currency).map(item => (
                        <option key={item}>{item}</option>
                      ))}
                    </Select>
                  </FormControl>
                );
              }
            },
            {
              title: "Value",
              render: rowData => {
                return (
                  <>
                    <StompClient
                      endpoint={process.env.REACT_APP_WEBSOCKET_URL}
                      topic="topic/exchange"
                      onMessage={message => {
                        const newExchangeRate = JSON.parse(
                          message.body
                        ) as IExchnageRate;

                        setCurrencyRate(newExchangeRate);
                      }}
                    >
                      {currencyRate.exchangeRate > 0 && (
                        <>
                          <FormControl>
                            <TextField
                              id="standard-basic1"
                              label="Converted value"
                              value={currencyRate.convertedValue}
                            />
                          </FormControl>
                          <FormControl>
                            <TextField
                              id="standard-basic1"
                              label="Rate"
                              value={currencyRate.exchangeRate}
                            />
                          </FormControl>
                        </>
                      )}
                    </StompClient>
                  </>
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
                    newData.productCategoryId = activeItemId;
                    data.push(newData);
                    newData.currency = Currency.EUR;
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
                      newData.productCategoryId = activeItemId;
                      newData.currency = Currency.EUR;
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
