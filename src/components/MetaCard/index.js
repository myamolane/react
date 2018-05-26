import { Card } from 'antd';
const { Meta } = Card;
import React, {PureComponent} from 'react';

export default class MetaCard extends PureComponent{
    render(){
        const { title, description, img} = this.props;
        return (
            <Card 
                hoverable
                style={{width: 160, backgroundColor: '#BBCFDA'}}
                cover={<img alt={title} src={img}/>}
            >
                <Meta
                    title={title}
                    description={description}
                />
            </Card>
        )
    }
}