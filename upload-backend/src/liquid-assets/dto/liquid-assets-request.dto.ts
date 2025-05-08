export class LiquidAssetsRequestDto {
  totalDailyLiquidAssets: number; // Total Value of Daily Liquid Assets
  totalWeeklyLiquidAssets: number; // Total Value of Weekly Liquid Assets
  percentageDailyLiquidAssets: number; // Percentage of Total Assets in Daily Liquid Assets
  percentageWeeklyLiquidAssets: number;
  TotalAssetsValue: number; // Total Assets Value
  date: Date; // Date
  createDate: Date;
  updateDate: Date;
  isDeleted: boolean;
}
