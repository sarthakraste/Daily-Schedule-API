module.exports = function (seq, DataTypes) {
return seq.define('todo', {
description: {
type:DataTypes.STRING,
allowNull:false,
validate : {
	len:[1, 250]
}
},

completed: {
type: DataTypes.BOOLEAN,
allowNull:false,
defaultValue:false
}

});


};