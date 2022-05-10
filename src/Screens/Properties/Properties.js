import { View, Text, SafeAreaView, TouchableOpacity, Image, TextInput, FlatList } from 'react-native'
import React, {useState} from 'react'
import styles from './styles'
import { IMAGES } from '../../Common/images'
import Properity from '../../Components/Properity'
import Units from '../../Components/Units'

const communitiesData = [
  {id : 1, title : 'La View', address : 'Al Mohammadiyah, Riyadh', building : 4, noUnit : 44},
  {id : 2, title : 'La View', address : 'Al Mohammadiyah, Riyadh', building : 4, noUnit : 44},
  {id : 3, title : 'La View', address : 'Al Mohammadiyah, Riyadh', building : 4, noUnit : 44},
  {id : 4, title : 'La View', address : 'Al Mohammadiyah, Riyadh', building : 4, noUnit : 44},
  {id : 5, title : 'La View', address : 'Al Mohammadiyah, Riyadh', building : 4, noUnit : 44},
  {id : 6, title : 'La View', address : 'Al Mohammadiyah, Riyadh', building : 4, noUnit : 44},
  {id : 7, title : 'La View', address : 'Al Mohammadiyah, Riyadh', building : 4, noUnit : 44},
  {id : 8, title : 'La View', address : 'Al Mohammadiyah, Riyadh', building : 4, noUnit : 44},
  {id : 9, title : 'La View', address : 'Al Mohammadiyah, Riyadh', building : 4, noUnit : 44},
  {id : 10, title : 'La View', address : 'Al Mohammadiyah, Riyadh', building : 4, noUnit : 44},
  {id : 11, title : 'La View', address : 'Al Mohammadiyah, Riyadh', building : 4, noUnit : 44},
]

const buildingsData = [
  {id : 1, title : 'Block A', address : 'Al Mohammadiyah, Riyadh', building : 'Executive living', noUnit : 600},
  {id : 2, title : 'Block B', address : 'Al Mohammadiyah, Riyadh', building : 'Executive living', noUnit : 44},
  {id : 3, title : 'Block C', address : 'Al Mohammadiyah, Riyadh', building : 'Executive living', noUnit : 600},
  {id : 4, title : 'Block D', address : 'Al Mohammadiyah, Riyadh', building : 'Executive living', noUnit : 44},
  {id : 5, title : 'Block E', address : 'Al Mohammadiyah, Riyadh', building : 'Executive living', noUnit : 600},
  {id : 6, title : 'Block F', address : 'Al Mohammadiyah, Riyadh', building : 'Executive living', noUnit : 44},
  {id : 7, title : 'Block G', address : 'Al Mohammadiyah, Riyadh', building : 'Executive living', noUnit : 600},
  {id : 8, title : 'Block H', address : 'Al Mohammadiyah, Riyadh', building : 'Executive living', noUnit : 44},
  {id : 9, title : 'Block I', address : 'Al Mohammadiyah, Riyadh', building : 'Executive living', noUnit : 600},
  {id : 10, title : 'Block J', address : 'Al Mohammadiyah, Riyadh', building : 'Executive living', noUnit : 44},
  {id : 11, title : 'Block K', address : 'Al Mohammadiyah, Riyadh', building : 'Executive living', noUnit : 600},
]

const unitsData = [
  {id : 1, title : 'Unit 51', status : false, unitType : 0, subType : 0, building : 'Block A', build : 'Executive living'},
  {id : 2, title : 'Plot 351', status : true, unitType : 0, subType : 1, build : 'Community Undefined'},
  {id : 3, title : 'Unit 101', status : true, unitType : 0, subType : 2, build : 'Executive living'},
  {id : 4, title : 'Plot 600', status : false, unitType : 1, subType : 0, build : 'Executive living'},
  {id : 5, title : 'Unit 51', status : false, unitType : 1, subType : 1, building : 'Block A', build : 'Executive living'},
  {id : 6, title : 'Plot 351', status : false, unitType : 1, subType : 2, building : 'Block A', build : 'Executive living'},
  {id : 7, title : 'Unit 101', status : false, unitType : 1, subType : 3, build : 'Executive living'},
  {id : 8, title : 'Plot 600', status : false, unitType : 1, subType : 4, build : 'Executive living'},
]

const Properties = (props) => {
  const [activeTab, setActiveTab] = useState(0)

  const Flat = (props) => {
    return(
      <FlatList
        data={props.data}
        renderItem={props.renderItem}
        showsVerticalScrollIndicator={false}
        style={styles.list}
        ListFooterComponent={<View />}
        ListFooterComponentStyle={styles.list}/>
    )
  }

  return (
    <SafeAreaView
      style={styles.main}>
      <View style={styles.header}>
        <TouchableOpacity>
          <Image 
            source={IMAGES.menu}
            resizeMode='contain'
            style={styles.img}/>
        </TouchableOpacity>
        <Text style={styles.headerText}>{'Properties'}</Text>
        <TouchableOpacity>
          <Image 
            source={IMAGES.bell}
            resizeMode='contain'
            style={styles.img}/>
        </TouchableOpacity>
      </View>
      <View style={styles.searchContainer}>
        <Image 
          source={IMAGES.search}
          resizeMode='contain'
          style={styles.img}/>
        <TextInput 
          placeholder='Search'
          placeholderTextColor={'#818b91'}
          style={styles.input}/>
      </View>
      <View
        style={styles.tabContainer}>
        <TouchableOpacity
          onPress={() => setActiveTab(0)} 
          style={activeTab === 0 ? styles.activeTab : styles.tab}>
          <Text style={[styles.tabText, activeTab === 0 ? styles.activeText : null ]}>{'Communities'}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setActiveTab(1)} 
          style={activeTab === 1 ? styles.activeTab : styles.tab}>
          <Text style={[styles.tabText, activeTab === 1 ? styles.activeText : null ]}>{'Building'}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setActiveTab(2)} 
          style={activeTab === 2 ? styles.activeTab : styles.tab}>
          <Text style={[styles.tabText, activeTab === 2 ? styles.activeText : null ]}>{'Units'}</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.details}>
        {activeTab === 0 ? 
        <Text style={styles.no}>{'No. of Communities: 24'}</Text> :
         activeTab === 1 ?
        <Text style={styles.no}>{'No. of Buildings: 50'}</Text> :
        <Text style={styles.no}>{'No. of Units: 500'}</Text>}
        <TouchableOpacity style={styles.sortContainer}>
          <Image 
            source={IMAGES.sort}
            resizeMode='contain'
            style={styles.sort} />
          <Text style={styles.sortText}>{'Sort'}</Text>
          <Image 
            source={IMAGES.dropdown}
            resizeMode='contain'
            style={styles.drop} />
        </TouchableOpacity>
        {activeTab === 2 ?
        <TouchableOpacity style={styles.sortContainer}>
        <Image 
          source={IMAGES.filter}
          resizeMode='contain'
          style={styles.sort} />
        <Text style={styles.sortText}>{'Filter'}</Text>
        <Image 
          source={IMAGES.dropdown}
          resizeMode='contain'
          style={styles.drop} />
      </TouchableOpacity> : null}
      </View>
      {activeTab === 0 ?
        <Flat 
          data={communitiesData}
          renderItem={Properity}/> :
       activeTab === 1 ?
        <Flat 
          data={buildingsData}
          renderItem={Properity}/> :
        <Flat 
          data={unitsData}
          renderItem={Units}/>
        }
      <TouchableOpacity
        onPress={() => props.navigation.navigate('AddCommunity')}
        style={styles.plusContainer}>
        <Image 
          source={IMAGES.plus}
          resizeMode='contain'
          style={styles.plus}/>
      </TouchableOpacity>
    </SafeAreaView>
  )
}

export default Properties