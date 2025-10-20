import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Trophy, Medal, Award } from 'lucide-react';

export default function Leaderboard({ users = [] }) {
  const sortedUsers = [...users].sort((a, b) => b.points - a.points);

  const getRankIcon = (index) => {
    switch (index) {
      case 0:
        return <Trophy className="w-6 h-6 text-yellow-500" />;
      case 1:
        return <Medal className="w-6 h-6 text-gray-400" />;
      case 2:
        return <Award className="w-6 h-6 text-amber-600" />;
      default:
        return (
          <div className="w-6 h-6 flex items-center justify-center font-semibold text-gray-600">
            {index + 1}
          </div>
        );
    }
  };

  const getRankBadgeColor = (index) => {
    switch (index) {
      case 0:
        return 'bg-yellow-100 border-yellow-300';
      case 1:
        return 'bg-gray-100 border-gray-300';
      case 2:
        return 'bg-amber-100 border-amber-300';
      default:
        return 'bg-white border-gray-200';
    }
  };

  return (
    <section className="py-10 px-4 max-w-4xl mx-auto">
      <h2 className="text-3xl font-bold mb-8 text-center">
        <Trophy className="inline-block w-8 h-8 mr-2 text-yellow-500" />
        Leaderboard
      </h2>

      <Card className="shadow-lg">
        <CardHeader className="bg-gradient-to-r border-b">
          <CardTitle className="text-xl">Top Doners</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y">
            {sortedUsers.map((user, index) => (
              <div key={index} className="flex items-center justify-between p-4">
                <div className="flex items-center gap-4 flex-1">
                  <div
                    className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${getRankBadgeColor(
                      index
                    )}`}
                  >
                    {getRankIcon(index)}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 text-lg">{user.displayName.toUpperCase()}</p>
                  </div>
                </div>

                <div className="text-right">
                  <p className="text-2xl font-bold text-amber-700">{user.points}</p>
                  <p className="text-xs text-gray-500 uppercase tracking-wide">Points</p>
                </div>
              </div>
            ))}
          </div>

          {sortedUsers.length === 0 && (
            <div className="p-8 text-center text-gray-500">
              <Trophy className="w-12 h-12 mx-auto mb-3 text-gray-300" />
              <p>No users on the leaderboard yet.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </section>
  );
}
