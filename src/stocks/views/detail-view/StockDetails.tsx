import React from 'react';
import './StockDetails.css';

import { Descriptions,
    DescriptionsProps,
    Spin
} from 'antd';
import { StockAPI } from '../../apis/StockAPI';
import { StockType } from '../../StockTypes';


interface IStockDetailsProps {
    /** Stock Id which details to be shown **/
    stockId: string;
    /** Callback on closing the component **/
    onClose: () => void;
}

interface IStockDetailsState {
    /** Initial state till the data is fetched **/
    initializing: boolean;
    /** Stock Id state which details to be shown **/
    stockId: string;
    /** Stock details updated fetched from server **/
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

    /**
     * fetch the details when the component is loaded
     */
    public componentDidMount(): void {
        void this.fetchStockInfo();
    }

    /**
     * On update of props, fetch the element details and update the state
     * @param prevProps
     */
    public componentDidUpdate(prevProps: any): void {
        if (this.props.stockId !== prevProps.stockId) {
            this.setState({
                stockId: this.props.stockId
            }, () => {
                void this.fetchStockInfo();
            });
        }
    }

    /**
     * Render details component
     */
    public render(): React.ReactNode {
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


    /**
     * Fetch stock details
     * @private
     */
    private async fetchStockInfo(): Promise<void> {
        await StockAPI.fetchStockInfo(this.state.stockId).then((stockData) => {
            this.setState({stockData, initializing: false})
        });
    }

    /**
     * Return details list item
     * @private
     */
    private getItems(): DescriptionsProps['items'] {
        const stock = this.state.stockData;
        if (!stock) {
            return [];
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
