import React from 'react';
import './StockApp.css';
import StockList from './list-view/StockList';
import StockDetails from './detail-view/StockDetails';
import { Layout } from 'antd';
const { Header, Content } = Layout;

interface IStockListProps {}


interface IStockListState {
    /** Selected Stock for detail display **/
    selectedStock: null | string;
}

export default class StockApp extends React.Component<IStockListProps, IStockListState>{

    constructor(props: IStockListProps) {
        super(props);
        this.state = {
            selectedStock: null
        };
    }

    /**
     * Render the Stock App
     */
    public render(): React.ReactNode {
        return (
            <div className={'stock-app'}>
                <Header className={'stock-header'}>
                    {'Stock Project'}
                </Header>

                <Content className={'stock-content'}>
                    <StockList
                        onStockSelection={this.onStockSelection.bind(this)}
                        onDelete={(stockId: string) => {
                            if (stockId === this.state.selectedStock) {
                                this.onCloseDetails();
                            }
                        }}
                    />
                    {this.state.selectedStock && (
                        <StockDetails
                            stockId={this.state.selectedStock}
                            onClose={this.onCloseDetails.bind(this)}
                        />
                    )}
                </Content>
            </div>
        );

    }

    /**
     * Set the state of the selected stock as null and close the details view
     * @private
     */
    private onCloseDetails(): void {
        this.setState({
            selectedStock: null
        });
    }

    /**
     * On Stock selection, update the state with stock in context
     * @param selectedStock Selected Stock from the list view
     * @private
     */
    private onStockSelection(selectedStock: string | null): void {
        this.setState({
            selectedStock
        });
    }
}

