import React from 'react';
import './StockList.css';

import {
    Button,
    notification,
    Popconfirm, Select,
    Space,
    Table,
    TableColumnsType
} from 'antd';

import { ReloadOutlined } from '@ant-design/icons';

import { StockType } from '../../StockTypes';
import { StockAPI } from '../../apis/StockAPI';
import { ALL_KEY, MAX_PAGE_SIZE } from '../StockConstants';

interface IStockListProps {
    /** Callback on Stock Selection **/
    onStockSelection: (selectedStock: string | null) => void;
    /** Callback on Stock deletion **/
    onDelete: (selectedStock: string) => void;
}

interface IStockListState {
    /** Initial State till component is loaded **/
    initializing: boolean;
    /** When the list is refreshed **/
    loading: boolean;
    /** List Data **/
    data?: StockType[];
    /** List of Tags to be displayed **/
    availableTags?: string[];
    /** Selected Tag **/
    selectedTag?: string;
    /** Selected Stock **/
    selectedStockId?: string | null;
    /** Current Page Number **/
    currentPage?: number;

}

export default class StockList extends React.Component<IStockListProps, IStockListState> {

    constructor(props: IStockListProps) {
        super(props);
        this.state = {
            loading: true,
            initializing: true,
            selectedTag: ALL_KEY,
            currentPage: 1
        };
    }

    /**
     * When the component is mounted, fetch the list of stocks
     */
    public async componentDidMount(): Promise<void> {
        await this.fetchStocks();
    }

    /**
     * Render the list component
     */
    public render(): React.ReactNode {
        return (
            <div>
                {this.getTableHeader()}
                <Table
                    columns={this.getColumns()}
                    loading={this.state.loading}
                    dataSource={this.state.data}
                    rowKey={'id'}
                    pagination={{
                        current: this.state?.currentPage || 1,
                        defaultPageSize: MAX_PAGE_SIZE,
                        onChange: (page)=> {
                            this.setState({currentPage: page});
                        }}}
                />
            </div>
        );
    }

    /**
     * Fetch the list of stock to be displayed on list
     * @private
     */
    private async fetchStocks(): Promise<void> {
        const data: StockType[] = await StockAPI.fetchStocks(this.state?.selectedTag);
        const selectedStock: StockType[] = data.filter(stock => stock.id === this.state?.selectedStockId);

        let stateUpdates: IStockListState = {
            data,
            loading: false,
            initializing: false
        }

        // If the selected stock is not found in new list, let the parent know and update set state too
        if (selectedStock.length === 0) {
            this.props.onStockSelection(null);
            stateUpdates = {
                ...stateUpdates,
                selectedStockId: null
            };
        }

        // Update the tags only when user select All again or nothing is selected initially
        if (!this.state || this.state.selectedTag === ALL_KEY) {
            const tagSet = new Set<string>();
            data.forEach(stock => {
                stock.tag && tagSet.add(stock.tag);
            });

            stateUpdates = {
                ...stateUpdates,
                availableTags: Array.from(tagSet),
            };
        }

        // update state
        this.setState(stateUpdates);
    }

    /**
     * Return the list of columns
     * @private
     */
    private getColumns(): TableColumnsType<StockType> {
        const columns: TableColumnsType<StockType> = [
            {
                title: 'Symbol',
                dataIndex: 'symbol',
                key: 'symbol',
                render: (text, stock) =>
                    <a
                        onClick={() => {
                            // handle click action on the stock symbol
                            this.setState({selectedStockId: stock.id}, () => {
                                this.props.onStockSelection(stock.id);
                            });
                        }}
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
                className: 'stock-action',
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
                        <Button type={'link'}>X</Button>
                    </Popconfirm>
                ),
            },
        ];

        return columns;
    }

    /**
     * Return Table Header
     * @private
     */
    private getTableHeader(): React.ReactNode {
        return <div className={'stock-list-header'}>
            {this.getTagsSelection()}
            <ReloadOutlined onClick={this.fetchStocks.bind(this)}/>
        </div>
    }

    /**
     * Return tag selection
     * @private
     */
    private getTagsSelection(): React.ReactNode {
        if (!this.state || this.state.initializing) {
            return <></>;
        }

        // Create option list and add All Key
        const options = (this.state.availableTags || []).map(tag => {
            return {value: tag, label: tag}
        });
        options.unshift({value: ALL_KEY, label: 'All'});

        return (<div>
            <span className={'stock-list-header-tag'}>Tag:</span>
            <Select
                className={'stock-list-header-select'}
                defaultValue={ALL_KEY}
                disabled={this.state.loading}
                popupMatchSelectWidth={false}
                onChange={this.handleTagChange.bind(this)}
                options={options}
            /></div>)
    }

    /**
     * Handle tag selection change
     * @param selectedTag
     * @private
     */
    private handleTagChange(selectedTag: string): void {
        this.setState({
            selectedTag,
            currentPage: 1
        }, () => {
            void this.fetchStocks();
        });
    }

    /**
     * Handle deleting of the stock
     * @param record
     * @private
     */
    private async deleteListItem(record: StockType): Promise<void> {
        void  StockAPI.deleteStock(record.id).then(isSuccess => {
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
                    this.props.onDelete(record.id);
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
