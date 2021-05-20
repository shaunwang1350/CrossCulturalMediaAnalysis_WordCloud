"""first commit

Revision ID: 3c4bd1ec35d2
Revises: 
Create Date: 2020-05-05 16:26:48.827630

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '3c4bd1ec35d2'
down_revision = None
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('affinity',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('name', sa.String(length=16), nullable=True),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('commits',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('index', sa.String(length=8), nullable=True),
    sa.Column('affinity_id', sa.Integer(), nullable=True),
    sa.Column('message', sa.String(length=4096), nullable=True),
    sa.Column('video_date', sa.DateTime(), nullable=True),
    sa.ForeignKeyConstraint(['affinity_id'], ['affinity.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('common',
    sa.Column('src_id', sa.Integer(), nullable=True),
    sa.Column('dest_id', sa.Integer(), nullable=True),
    sa.ForeignKeyConstraint(['dest_id'], ['commits.id'], ),
    sa.ForeignKeyConstraint(['src_id'], ['commits.id'], )
    )
    op.create_table('images',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('path', sa.String(length=140), nullable=True),
    sa.Column('commit_id', sa.Integer(), nullable=True),
    sa.ForeignKeyConstraint(['commit_id'], ['commits.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('tags',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('tag', sa.String(length=140), nullable=True),
    sa.Column('commit_id', sa.Integer(), nullable=True),
    sa.ForeignKeyConstraint(['commit_id'], ['commits.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_table('tags')
    op.drop_table('images')
    op.drop_table('common')
    op.drop_table('commits')
    op.drop_table('affinity')
    # ### end Alembic commands ###