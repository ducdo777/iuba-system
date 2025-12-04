import { Injectable } from '@nestjs/common';
import { ActivityDataService } from '../activity-data/activity-data.service';
import { TeamsService } from '../teams/teams.service';
import { UsersService } from '../users/users.service';

@Injectable()
export class StatisticsService {
  constructor(
    private activityDataService: ActivityDataService,
    private teamsService: TeamsService,
    private usersService: UsersService,
  ) {}

  async getOverview(startDate?: string, endDate?: string) {
    const allTeams = await this.teamsService.findAll();
    const allUsers = await this.usersService.findAll();
    const allData = await this.activityDataService.findAll(undefined, undefined, startDate, endDate);

    const totals = {
      donThuan: 0,
      huuHieu: 0,
      baptem: 0,
      thoPhuong: 0,
      lapCLB: 0,
      lenGiaiDoan: 0,
    };

    allData.forEach(data => {
      totals.donThuan += data.donThuan || 0;
      totals.huuHieu += data.huuHieu || 0;
      totals.baptem += data.baptem || 0;
      totals.thoPhuong += data.thoPhuong || 0;
      totals.lapCLB += data.lapCLB || 0;
      totals.lenGiaiDoan += data.lenGiaiDoan || 0;
    });

    const byTeam = await Promise.all(
      allTeams.map(async (team) => {
        const teamData = await this.activityDataService.findAll(team.id, undefined, startDate, endDate);
        const teamUsers = allUsers.filter(u => u.teamId === team.id);
        const teamTotals = {
          donThuan: 0,
          huuHieu: 0,
          baptem: 0,
          thoPhuong: 0,
          lapCLB: 0,
          lenGiaiDoan: 0,
        };

        teamData.forEach(data => {
          teamTotals.donThuan += data.donThuan || 0;
          teamTotals.huuHieu += data.huuHieu || 0;
          teamTotals.baptem += data.baptem || 0;
          teamTotals.thoPhuong += data.thoPhuong || 0;
          teamTotals.lapCLB += data.lapCLB || 0;
          teamTotals.lenGiaiDoan += data.lenGiaiDoan || 0;
        });

        return {
          teamId: team.id,
          teamCode: team.teamCode,
          teamName: team.teamName,
          totalMembers: teamUsers.length,
          ...teamTotals,
          total: Object.values(teamTotals).reduce((a, b) => a + b, 0),
        };
      })
    );

    return {
      summary: {
        totalTeams: allTeams.length,
        totalUsers: allUsers.length,
        totalRecords: allData.length,
        ...totals,
        grandTotal: Object.values(totals).reduce((a, b) => a + b, 0),
      },
      byTeam,
    };
  }

  async getByTeam(teamId?: string, startDate?: string, endDate?: string) {
    const teams = teamId ? [await this.teamsService.findOne(teamId)] : await this.teamsService.findAll();
    const allUsers = await this.usersService.findAll(teamId);

    const result = await Promise.all(
      teams.map(async (team) => {
        const teamData = await this.activityDataService.findAll(team.id, undefined, startDate, endDate);
        const teamUsers = allUsers.filter(u => u.teamId === team.id);

        const byUser = teamUsers.map(user => {
          const userData = teamData.filter(d => d.userId === user.id);
          const userTotals = {
            donThuan: 0,
            huuHieu: 0,
            baptem: 0,
            thoPhuong: 0,
            lapCLB: 0,
            lenGiaiDoan: 0,
          };

          userData.forEach(data => {
            userTotals.donThuan += data.donThuan || 0;
            userTotals.huuHieu += data.huuHieu || 0;
            userTotals.baptem += data.baptem || 0;
            userTotals.thoPhuong += data.thoPhuong || 0;
            userTotals.lapCLB += data.lapCLB || 0;
            userTotals.lenGiaiDoan += data.lenGiaiDoan || 0;
          });

          return {
            userId: user.id,
            username: user.username,
            fullName: user.fullName,
            ...userTotals,
            total: Object.values(userTotals).reduce((a, b) => a + b, 0),
            recordCount: userData.length,
          };
        });

        const teamTotals = {
          donThuan: 0,
          huuHieu: 0,
          baptem: 0,
          thoPhuong: 0,
          lapCLB: 0,
          lenGiaiDoan: 0,
        };

        teamData.forEach(data => {
          teamTotals.donThuan += data.donThuan || 0;
          teamTotals.huuHieu += data.huuHieu || 0;
          teamTotals.baptem += data.baptem || 0;
          teamTotals.thoPhuong += data.thoPhuong || 0;
          teamTotals.lapCLB += data.lapCLB || 0;
          teamTotals.lenGiaiDoan += data.lenGiaiDoan || 0;
        });

        return {
          teamId: team.id,
          teamCode: team.teamCode,
          teamName: team.teamName,
          totalMembers: teamUsers.length,
          byUser,
          summary: {
            ...teamTotals,
            total: Object.values(teamTotals).reduce((a, b) => a + b, 0),
            recordCount: teamData.length,
          },
        };
      })
    );

    return teamId ? result[0] : result;
  }
}
