<?php

namespace PNC\ChiroBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;

use Symfony\Component\HttpFoundation\JsonResponse;

class ObsTaxonConfigController extends Controller{

    // path : GET chiro/config/obstaxon/form
    public function getFormAction(){
        $norm = $this->get('normalizer');
        $repo = $this->getDoctrine()->getRepository('PNCBaseAppBundle:Thesaurus');
        $types = $repo->findBy(array('id_type'=>9));
        $typesVal = array();
        foreach($types as $tl){
            if($tl->getFkParent() != 0){
                $typesVal[] = $norm->normalize($tl, array());
            }
        }

        $out = array(
            'groups'=>array(
                array(
                    'name'=>'Informations',
                    'fields'=>array(
                        array(
                            'name'=>'obsId',
                            'label'=>'Id observation',
                            'type'=>'hidden',
                            'help'=>'',
                            'options'=>array()
                        ),
                        array(
                            'name'=>'cdNom',
                            'label'=>'Nom taxon',
                            'type'=>'xhr',
                            'help'=>'',
                            'options'=>array('url'=>'chiro/taxons', 'reverseurl'=>'chiro/taxons/id', 'ref'=>'cdNom')
                        ),
                        array(
                            'name'=>'obsTxInitial',
                            'label'=>'Taxon initial',
                            'type'=>'string',
                            'help'=>'',
                            'options'=>array()
                        ),
                        array(
                            'name'=>'obsObjStatusValidation',
                            'label'=>'Statut validation',
                            'type'=>'select',
                            'help'=>'',
                            'options'=>array('choices'=> $typesVal),
                            'default'=>56
                        ),
                        array(
                            'name'=>'obsValidateur',
                            'label'=>'Validateur',
                            'type'=>'xhr',
                            'help'=>'',
                            'options'=>array('url'=>'chiro/observateurs', 'reverseurl'=>'chiro/observateurs/id', 'ref'=>'obsValidateur')
                        ),
                        array(
                            'name'=>'obsEspeceIncertaine',
                            'label'=>'Espece incertaine',
                            'type'=>'bool',
                            'help'=>'',
                            'options'=>array()
                        ),
                        array(
                            'name'=>'obsCommentaire',
                            'label'=>'Commentaire',
                            'type'=>'text',
                            'help'=>"Informations complémentaires sur l'observation",
                            'options'=>array()
                        ),
                    ),
                ),
                array(
                    'name'=>'Enumeration',
                    'fields'=>array(
                        array(
                            'name'=>'obsEffectifAbs',
                            'label'=>'Effectif total',
                            'type'=>'sum',
                            'help'=>'',
                            'options'=>array(
                                'ref'=>array('obsNbMaleAdulte', 'obsNbFemelleAdulte', 'obsNbMaleJuvenile', 'obsNbFemelleJuvenile', 'obsNbMaleIndetermine', 'obsNbFemelleIndetermine', 'obsNbIndetermineIndetermine'), 
                                'modifiable'=>true
                            )
                        ),
                        array(
                            'name'=>'obsNbMaleAdulte',
                            'label'=>'Mâles adultes',
                            'type'=>'num',
                            'help'=>'',
                            'options'=>array()
                        ),
                        array(
                            'name'=>'obsNbFemelleAdulte',
                            'label'=>'Femelles adultes',
                            'type'=>'num',
                            'help'=>'',
                            'options'=>array()
                        ),
                        array(
                            'name'=>'obsNbMaleJuvenile',
                            'label'=>'Mâles juveniles',
                            'type'=>'num',
                            'help'=>'',
                            'options'=>array()
                        ),
                        array(
                            'name'=>'obsNbFemelleJuvenile',
                            'label'=>'Femelles juveniles',
                            'type'=>'num',
                            'help'=>'',
                            'options'=>array()
                        ),
                        array(
                            'name'=>'obsNbMaleIndetermine',
                            'label'=>'Mâles indeterminés',
                            'type'=>'num',
                            'help'=>'Age indéterminé',
                            'options'=>array()
                        ),
                        array(
                            'name'=>'obsNbFemelleIndetermine',
                            'label'=>'Femelles indeterminées',
                            'type'=>'num',
                            'help'=>'Age indéterminé',
                            'options'=>array()
                        ),
                        array(
                            'name'=>'obsNbIndetermineIndetermine',
                            'label'=>'Indetermines indeterminés',
                            'type'=>'num',
                            'help'=>'Age et sexe indéterminés',
                            'options'=>array()
                        ),
                    ),
                ),
            ),
        );

        return new JsonResponse($out);
    }
    
    // path : GET chiro/config/obstaxon/detail
    public function getDetailAction(){
        $norm = $this->get('normalizer');
        $repo = $this->getDoctrine()->getRepository('PNCBaseAppBundle:Thesaurus');
        $types = $repo->findBy(array('id_type'=>9));
        $typesVal = array();
        foreach($types as $tl){
            if($tl->getFkParent() != 0){
                $typesVal[] = $norm->normalize($tl, array());
            }
        }

        $out = array(
            'subSchemaUrl'=>'chiro/config/biometrie/list',
            'subDataUrl'=>'chiro/biometrie/taxon/',
            'groups'=>array(
                array(
                    'name'=>'Général',
                    'fields'=>array(
                        array(
                            'name'=>'cdNom',
                            'label'=>'Cd nom',
                            'type'=>'num',
                            'help'=>'',
                            'options'=>array()
                        ),
                        array(
                            'name'=>'nomComplet',
                            'label'=>'Nom taxon',
                            'type'=>'string',
                            'help'=>'',
                            'options'=>array()
                        ),
                        array(
                            'name'=>'obsTxInitial',
                            'label'=>'Taxon initial',
                            'type'=>'string',
                            'help'=>'',
                            'options'=>array()
                        ),
                        array(
                            'name'=>'obsCommentaire',
                            'label'=>'Commentaire',
                            'type'=>'string',
                            'help'=>'',
                            'options'=>array()
                        ),
                        array(
                            'name'=>'obsValidateur',
                            'label'=>'Validateur',
                            'type'=>'xhr',
                            'help'=>'',
                            'options'=>array('url'=>'chiro/observateurs/id')
                        ),
                        array(
                            'name'=>'obsEspeceIncertaine',
                            'label'=>'Espece incertaine',
                            'type'=>'bool',
                            'help'=>'',
                            'options'=>array()
                        ),
                        array(
                            'name'=>'obsEffectifAbs',
                            'label'=>'Effectif total',
                            'type'=>'num',
                            'help'=>'',
                            'options'=>array()
                        ),
                    ),
                ),
                array(
                    'name'=> 'Détail',
                    'fields'=>array(
                        array(
                            'name'=>'obsNbMaleAdulte',
                            'label'=>'Mâles adultes',
                            'type'=>'num',
                            'help'=>'',
                            'options'=>array()
                        ),
                        array(
                            'name'=>'obsNbFemelleAdulte',
                            'label'=>'Femelles adultes',
                            'type'=>'num',
                            'help'=>'',
                            'options'=>array()
                        ),
                        array(
                            'name'=>'obsNbMaleJuvenile',
                            'label'=>'Mâles juveniles',
                            'type'=>'num',
                            'help'=>'',
                            'options'=>array()
                        ),
                        array(
                            'name'=>'obsNbFemelleJuvenile',
                            'label'=>'Femelles juveniles',
                            'type'=>'num',
                            'help'=>'',
                            'options'=>array()
                        ),
                        array(
                            'name'=>'obsNbMaleIndetermine',
                            'label'=>'Mâles indeterminés',
                            'type'=>'num',
                            'help'=>'Age indéterminé',
                            'options'=>array()
                        ),
                        array(
                            'name'=>'obsNbFemelleIndetermine',
                            'label'=>'Femelles indeterminées',
                            'type'=>'num',
                            'help'=>'Age indéterminé',
                            'options'=>array()
                        ),
                        array(
                            'name'=>'obsNbIndetermineIndetermine',
                            'label'=>'Indetermines indeterminés',
                            'type'=>'num',
                            'help'=>'Age et sexe indéterminés',
                            'options'=>array()
                        ),
                        array(
                            'name'=>'obsObjStatusValidation',
                            'label'=>'Statut validation',
                            'type'=>'select',
                            'help'=>'',
                            'options'=>array('choices'=>$typesVal)
                        ),
                    ),
                ),
            ),
        );

        return new JsonResponse($out);
    }

    // path : GET chiro/config/obstaxon/list
    public function getListAction(){
        $norm = $this->get('normalizer');
        $repo = $this->getDoctrine()->getRepository('PNCBaseAppBundle:Thesaurus');
        $types = $repo->findBy(array('id_type'=>9));
        $typesVal = array();
        foreach($types as $tl){
            if($tl->getFkParent() != 0){
                $typesVal[] = $norm->normalize($tl, array());
            }
        }

        $out = array(
            'title'=>'Taxons',
            'emptyMsg'=>'Aucun taxon observé',
            'createBtnLabel'=>'Ajouter taxon',
            'createUrl'=>'#/chiro/edit/taxons/observation/',
            'fields'=>array(
                array(
                    'name'=>'nomComplet',
                    'label'=>'Nom taxon',
                    'type'=>'link',
                    'url'=>'#chiro/taxons/',
                    'ref'=>'id',
                ),
                array(
                    'name'=>'obsEffectifAbs',
                    'label'=>'Effectif total',
                    'type'=>'string',
                    'options'=>array()
                ),
                array(
                    'name'=>'obsObjStatusValidation',
                    'label'=>'Statut validation',
                    'type'=>'select',
                    'options'=>array('choices'=>$typesVal)
                ),
            ),
        );

        return new JsonResponse($out);
    }
}


