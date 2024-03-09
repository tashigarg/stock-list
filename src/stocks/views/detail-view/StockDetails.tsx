import React from 'react';
import {StockType} from '../../StockTypes';
import {Descriptions, DescriptionsProps, Spin} from 'antd';
import './StockDetails.css';
import {StockAPI} from '../../apis/StockAPI';

interface IStockDetailsProps {
    stockId: string;
    onClose: () => void;
}

interface IStockDetailsState {
    stockId: string;
    initializing: boolean;
    stockData: StockType | null;
}

export default class StockDetails extends React.Component<IStockDetailsProps, IStockDetailsState> {

    constructor(props: IStockDetailsProps) {
        super(props);
        this.state = {
            stockId: props.stockId,
            initializing: true,
            stockData: null
        }
    }

    public render() {
        if (!this.state || this.state.initializing) {
            return <Spin/>;
        }

        return <div className={'stock-details'}>
            <Descriptions
                title='Stock Details'
                items={this.getItems()}
                column={2}
                extra={<a onClick={() => this.props.onClose()}>X</a>}
            />
        </div>
    }

    componentDidMount() {
        this.fetchStockInfo();
    }

    componentDidUpdate(prevProps: any) {
        if (this.props.stockId !== prevProps.stockId) {
            this.setState({
                stockId: this.props.stockId
            }, () => {
                this.fetchStockInfo();
            });
        }
    }

    private async fetchStockInfo() {
        await StockAPI.fetchStockInfo(this.state.stockId).then((stockData) => {
            this.setState({stockData, initializing: false})
        });
    }

    private getItems() {
        const stock = this.state.stockData;
        if (!stock) {
            return;
        }
        const items: DescriptionsProps['items'] = [
            {
                key: '1',
                label: 'Symbol',
                children: stock.symbol,
            },
            {
                key: '2',
                label: 'Name',
                children: stock.name,
            },
            {
                key: '3',
                label: 'Market Cap',
                children: stock.market_cap,
            },
            {
                key: '4',
                label: 'Tag',
                children: stock.tag,
            }
        ];

        return items;
    }
}
