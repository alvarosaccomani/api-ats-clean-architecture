import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../../db/sequelize';
import { TypeApplicationEntity } from '../../../domain/type-application/type-application.entity';

export class SequelizeTypeApplication extends Model<TypeApplicationEntity> {
  declare tapp_uuid: string;
  declare tapp_cod: string;
  declare tapp_name: string;
  declare tapp_description: string;
  declare tapp_bkcolor: string;
  declare tapp_frcolor: string;
  declare tapp_active: boolean;
  declare tapp_createdat: Date;
  declare tapp_updatedat: Date;
}

SequelizeTypeApplication.init({
  tapp_uuid: {
    type: DataTypes.STRING,
    primaryKey: true
  },
  tapp_cod: {
    type: DataTypes.STRING,
    allowNull: false
  },
  tapp_name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  tapp_description: {
    type: DataTypes.STRING,
    allowNull: true
  },
  tapp_bkcolor: {
    type: DataTypes.STRING,
    allowNull: true
  },
  tapp_frcolor: {
    type: DataTypes.STRING,
    allowNull: true
  },
  tapp_active: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true
  },
  tapp_createdat: {
    type: DataTypes.DATE,
    allowNull: true
  },
  tapp_updatedat: {
    type: DataTypes.DATE,
    allowNull: true
  }
}, {
  sequelize,
  timestamps: true,
  createdAt: 'tapp_createdat',
  updatedAt: 'tapp_updatedat',
  tableName: 'tapp_typesapplications'
});

// Sincronizar (solo en desarrollo)
if (process.env.NODE_ENV !== "production") {
    SequelizeTypeApplication.sync();
}
