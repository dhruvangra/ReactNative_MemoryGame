import React, { Component } from "react";
import { BackHandler, Dimensions, FlatList, StyleSheet, Text, TouchableOpacity, View } from "react-native";

const height = Dimensions.get('window').height;

export class ValProp {
    public id: string = "";
    public name: string = "";
    public clicked: boolean = false;
}

export class ClickEvents {
    public val1: ValProp = new ValProp();
    public val2: ValProp = new ValProp();
}

export interface PuzzleUiProps {
}
export interface PuzzleUiState {
    b_cardData: Array<any>;
    b_Moves: number;
    isGameoVer: boolean;
    on_input_res_disp_delay: boolean;
}

export default class PuzzleUi extends Component<PuzzleUiProps, PuzzleUiState>{

    b_ClickEvents: ClickEvents = new ClickEvents();
    CardDataSrc = [
        { id: 1, Value: "A", CardVisble: false, Counted: false }, { id: 2, Value: "B", CardVisble: false, Counted: false },
        { id: 3, Value: "C", CardVisble: false, Counted: false }, { id: 4, Value: "D", CardVisble: false, Counted: false },
        { id: 5, Value: "E", CardVisble: false, Counted: false }, { id: 6, Value: "F", CardVisble: false, Counted: false },
        { id: 7, Value: "G", CardVisble: false, Counted: false }, { id: 8, Value: "H", CardVisble: false, Counted: false },
        { id: 9, Value: "A", CardVisble: false, Counted: false }, { id: 10, Value: "B", CardVisble: false, Counted: false },
        { id: 11, Value: "C", CardVisble: false, Counted: false }, { id: 12, Value: "D", CardVisble: false, Counted: false },
        { id: 13, Value: "E", CardVisble: false, Counted: false }, { id: 14, Value: "F", CardVisble: false, Counted: false },
        { id: 15, Value: "G", CardVisble: false, Counted: false }, { id: 16, Value: "H", CardVisble: false, Counted: false },
    ];
    constructor(props: PuzzleUiProps) {
        super(props)
        this.state = {
            b_cardData: [...this.CardDataSrc],
            b_Moves: 0,
            isGameoVer: false,
            on_input_res_disp_delay: false,
        }
    }

    componentDidMount = () => {
        this.setState({ b_cardData: this.shuffleCards(this.state.b_cardData) })
        BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonClick);
    }

    componentWillUnmount = () => {
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackButtonClick);
    }

    handleBackButtonClick = () => {
        BackHandler.exitApp();
        return true;
    }

    shuffleCards = (array: any) => {
        for (let i = array.length - 1; i > 0; i--) {
            let j = Math.floor(Math.random() * (i + 1));
            let temp = array[i];
            array[i] = array[j];
            array[j] = temp;
        }
        return array;
    }

    onCardClk = (item: any) => {
        if (!this.b_ClickEvents.val2.clicked && !(item.Counted)) {
            if (this.b_ClickEvents.val1.id != item.id) {
                this.state.b_cardData.find((val) => {
                    if (val.id == item.id && !(val.Counted)) {
                        val.CardVisble = true;
                        return;
                    }
                })
                this.setState({});
                if (this.b_ClickEvents.val1.id == "") {
                    this.b_ClickEvents.val1.id = item.id;
                    this.b_ClickEvents.val1.name = item.Value;
                    this.b_ClickEvents.val1.clicked = true;
                    return;
                } else {
                    this.b_ClickEvents.val2.id = item.id;
                    this.b_ClickEvents.val2.name = item.Value;
                    this.b_ClickEvents.val2.clicked = true;
                }
                if (this.b_ClickEvents.val1.clicked && this.b_ClickEvents.val2.clicked) {
                    this.setState({on_input_res_disp_delay: true})
                    let timer = setTimeout(() => {
                        let checkingExistForGameOver = false;
                        this.state.b_cardData.find((val) => {
                            if (val.id == this.b_ClickEvents.val1.id || val.id == this.b_ClickEvents.val2.id) {
                                if (this.b_ClickEvents.val1.name == this.b_ClickEvents.val2.name) {
                                    checkingExistForGameOver = true;
                                    val.Counted = true;
                                    val.CardVisble = true;
                                } else {
                                    val.CardVisble = false;
                                }
                            }
                        })
                        if (checkingExistForGameOver) {
                            let res = this.state.b_cardData.reduce((acc, curr) => {
                                if (curr.Counted) {
                                    acc += 1;
                                }
                                return acc;
                            }, 0)
                            if (res == 16) {
                                this.setState({ isGameoVer: true })
                            }
                        }
                        this.b_ClickEvents = new ClickEvents();
                        this.setState({ b_Moves: this.state.b_Moves + 1,on_input_res_disp_delay:false});
                    }, 500);
                }
            }
        }
    }

    onPressReset = () => {
        let data: Array<any> = [...this.CardDataSrc].filter((val) => {
            val.Counted = false;
            val.CardVisble = false;
            return val;
        })
        this.setState({
            b_cardData: this.shuffleCards(data),
            b_Moves: 0, isGameoVer: false,
            on_input_res_disp_delay:false,
        })
        this.b_ClickEvents = new ClickEvents();

    }

    PuzzleCardView = (listitem: any) => {
        let data = listitem.item;
        let cardVisible = false;
        let CombinationMatch = false;
        if (data.CardVisble || (data.CardVisble && data.Counted)) {
            cardVisible = true;
        }
        if (data.CardVisble && data.Counted) {
            CombinationMatch = true;
        }

        return (
            <TouchableOpacity style={[styles.PuzzleCard_ViewStyle, { backgroundColor: cardVisible ? '#fff' : 'tomato' }]}
                onPress={() => { this.onCardClk(data) }}>
                <Text style={[styles.textstyle, { color: cardVisible && !CombinationMatch ? "#000" : "transparent" }]} >{data.Value}</Text>
            </TouchableOpacity>
        )
    }

    render() {
        return (
            <View pointerEvents={this.state.on_input_res_disp_delay ? "none" : "auto"} style={[styles.main_container]}>

                <View style={{ flex: 0.25 }}>
                    <Text style={styles.textstyle}>Memory Game</Text>
                    <View style={styles.count_Reset_View}>
                        <View style={styles.count_Reset_style}>
                            <Text style={styles.count_Reset_Textstyle}>Moves : {this.state.b_Moves}</Text>
                        </View>
                        <TouchableOpacity style={styles.count_Reset_style} onPress={this.onPressReset}>
                            <Text style={styles.count_Reset_Textstyle}>Restart</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {this.state.isGameoVer ?
                    <View style={{ flex: 0.75 }}>
                        <Text style={styles.textstyle}>Game Over in {this.state.b_Moves} Moves</Text>
                    </View>
                    :
                    <FlatList style={{ flex: 0.75 }} numColumns={4}
                        renderItem={this.PuzzleCardView} data={this.state.b_cardData}
                        keyExtractor={(item, index) => { return item.id; }} />
                }

            </View>
        )
    }
}

const styles = StyleSheet.create({
    main_container: {
        flex: 1, margin: "2%"
    },
    PuzzleCard_ViewStyle: {
        borderWidth: 1, height: height * 0.15,
        borderRadius: 10, width: "23%", marginHorizontal: '1%',
        marginVertical: '2%', justifyContent: 'center'
    },
    textstyle: {
        fontWeight: 'bold', fontSize: 24,
        color: '#000', textAlign: 'center'
    },

    count_Reset_View: {
        flexDirection: 'row', justifyContent: 'space-evenly',
        flex: 1, alignContent: 'center', alignItems: 'center'
    },
    count_Reset_style: {
        borderWidth: 1, height: height * 0.10,
        borderRadius: 10, width: "40%", justifyContent: 'center',
        alignItems: 'center'
    },
    count_Reset_Textstyle: {
        fontWeight: 'bold', fontSize: 18,
        color: '#000'
    }
});