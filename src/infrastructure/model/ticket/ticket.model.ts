import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../../db/sequelize';
import { TicketEntity } from '../../../domain/ticket/ticket.entity';

export class SequelizeTicket extends Model<TicketEntity> implements TicketEntity {
  declare tic_uuid: string;
  declare usr_uuid: string;
  declare app_uuid: string;
  declare tic_type: string;
  declare tic_title: string;
  declare tic_description: string;
  declare tic_status: string;
  declare tic_priority: string;
  declare tic_metadata: string | null;
  declare tic_admincomment: string | null;
  declare tic_images: string[] | null;
  declare tic_createdat: Date;
  declare tic_updatedat: Date;
}

SequelizeTicket.init({
  tic_uuid: {
    type: DataTypes.STRING(40),
    primaryKey: true
  },
  usr_uuid: {
    type: DataTypes.STRING(40),
    allowNull: false
  },
  app_uuid: {
    type: DataTypes.STRING(40),
    allowNull: false
  },
  tic_type: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  tic_title: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  tic_description: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  tic_status: {
    type: DataTypes.STRING(50),
    allowNull: false,
    defaultValue: 'PENDING'
  },
  tic_priority: {
    type: DataTypes.STRING(50),
    allowNull: false,
    defaultValue: 'MEDIUM'
  },
  tic_metadata: {
    type: DataTypes.JSONB,
    allowNull: true
  },
  tic_admincomment: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  tic_images: {
    type: DataTypes.JSONB,
    allowNull: true
  },
  tic_createdat: {
    type: DataTypes.DATE,
    allowNull: true,
    defaultValue: DataTypes.NOW
  },
  tic_updatedat: {
    type: DataTypes.DATE,
    allowNull: true,
    defaultValue: DataTypes.NOW
  }
}, {
  sequelize,
  timestamps: false,
  tableName: 'tic_tickets'
});

if (process.env.NODE_ENV !== "production") {
    SequelizeTicket.sync();
}
