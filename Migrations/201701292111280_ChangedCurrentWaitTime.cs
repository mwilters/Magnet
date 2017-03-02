namespace Magnet.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class ChangedCurrentWaitTime : DbMigration
    {
        public override void Up()
        {
            AddColumn("dbo.Locations", "WaitTime_ID", c => c.Guid());
            AlterColumn("dbo.WaitTimes", "CurrentWaitTime", c => c.Int(nullable: false));
        }
        
        public override void Down()
        {
            DropForeignKey("dbo.Locations", "WaitTime_ID", "dbo.WaitTimes");
            DropIndex("dbo.Locations", new[] { "WaitTime_ID" });
            AlterColumn("dbo.WaitTimes", "CurrentWaitTime", c => c.DateTime(nullable: false));
            DropColumn("dbo.Locations", "WaitTime_ID");
        }
    }
}
