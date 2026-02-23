export function up(pgm) {
  pgm.addColumn('albums', {
    cover_url: {
      type: 'TEXT',
      notNull: false,
    },
  });
}

export function down(pgm) {
  pgm.dropColumn('albums', 'cover_url');
}