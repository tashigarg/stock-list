import React from 'react';
import {
    Button,
    notification,
    Popconfirm, Select,
    Space,
    Table,
    TableColumnsType,
    Tag
} from 'antd';
import {StockType} from '../../StockTypes';
import {StockAPI} from '../../apis/StockAPI';
import ReloadIcon from '../../../images/reload.svg';
import './StockList.css';
import {ALL_KEY} from "../StockConstants";


interface IStockListProps {
    onStockSelection: (selectedStock: string) => void;
    onDelete: (selectedStock: string) => void;
}

interface IStockListState {
    loading: boolean;
    selectedTag?: string;
    initializing: boolean;
    data?: StockType[];
    availableTags?: string[];
}

export default class StockList extends React.Component<IStockListProps, IStockListState> {

    constructor(props: IStockListProps) {
        super(props);
        this.state = {
            loading: true,
            initializing: true
        };
    }

    public render() {
        return (
            <div>
                {this.getTableHeader()}
                <Table
                    columns={this.getColumns()}
                    loading={this.state.loading}
                    dataSource={this.state.data}
                    rowKey={'id'}
                    pagination={{
                        pageSize: 5
                    }}
                />
            </div>
        );
    }

    public async componentDidMount() {
        await this.fetchStocks();
    }


    private async fetchStocks() {
        const {data, tags} = await StockAPI.fetchStocks(this.state?.selectedTag);
        this.setState({
            data,
            availableTags: tags,
            loading: false,
            initializing: false
        });
    }

    private getColumns() {
        const columns: TableColumnsType<StockType> = [
            {
                title: 'Symbol',
                dataIndex: 'symbol',
                key: 'symbol',
                render: (text, stock) =>
                    <a
                        onClick={() => this.props.onStockSelection(stock.id)}
                    >{text}</a>,
            },
            {
                title: 'Last Price',
                dataIndex: 'last_price',
                key: 'last_price',
            },
            {
                title: 'Tag',
                key: 'tag',
                dataIndex: 'tag',
            },
            {
                title: 'Action',
                key: 'action',
                render: (_, record) => (
                    <Popconfirm
                        title='Delete stock'
                        description='Are you sure to delete this stock?'
                        onConfirm={() => {
                            void this.deleteListItem(record);
                        }}
                        okText='Yes'
                        cancelText='No'
                    >
                        <Space size='middle' key={record.symbol} className={'stock-action'}>
                            <Button type={'link'}>X</Button>
                        </Space>
                    </Popconfirm>
                ),
            },
        ];

        return columns;
    }

    private getTableHeader() {
        return <div className={'stock-list-header'}>
            <img src={ReloadIcon}  onClick={this.fetchStocks.bind(this)}/>
            {this.getTagsSelection()}
        </div>
    }

    private getTagsSelection() {
        if (!this.state) {
            return <></>;
        }

        const options = (this.state.availableTags || []).map(tag => {
            return {value: tag, label: tag}
        });
        options.unshift({value: '$$all$$', label: 'All'})

        return <Select
            defaultValue={ALL_KEY}
            disabled={this.state.loading}
            popupMatchSelectWidth={false}
            onChange={this.handleTagChange.bind(this)}
            options={options}
        />
    }

    private handleTagChange() {

    }

    private async deleteListItem(record: StockType) {
        StockAPI.deleteStock(record.id).then(isSuccess => {
            if (isSuccess) {
                notification.open({
                    message: `Delete Success`,
                    placement: 'topRight',
                    type: 'success',
                    description: `Stock ${record.name} is successfully removed!`,
                });
                this.setState({
                    loading: true
                }, () => {
                    this.fetchStocks();
                    this.props.onDelete(record.symbol);
                })
            } else {
                notification.open({
                    message: `Delete Error`,
                    type: 'error',
                    description: `Error in removing the stock ${record.name}.`,
                    placement: 'topRight',
                });
            }
        });
    }
}
